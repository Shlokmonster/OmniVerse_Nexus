
import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient.js';
import { getSocket, connectSocket } from '../services/socketClient.js';

export default function Simulation() {
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [intensity, setIntensity] = useState(50);
  const [recoveryTime, setRecoveryTime] = useState(180); // seconds
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulation, setSimulation] = useState(null);
  const [infraHealth, setInfraHealth] = useState(100);
  const [timeline, setTimeline] = useState([]);
  const [socket, setSocket] = useState(null);

  // Load available scenarios on mount
  useEffect(() => {
    const loadScenarios = async () => {
      try {
        const res = await apiClient.get('/chaos/scenarios');
        if (res.data.success) {
          setScenarios(res.data.data);
          setSelectedScenario(res.data.data.find(s => s.id === 'earthquake') || res.data.data[0]);
        }
      } catch (e) {
        console.error('Failed to load scenarios:', e);
      }
    };

    loadScenarios();

    // Connect to socket for updates
    const newSocket = connectSocket();
    setSocket(newSocket);

    newSocket?.on('chaos-simulation-update', (sim) => {
      setSimulation(sim);
      setInfraHealth(sim.infrastructureHealth || 100);
      if (sim.timeline) {
        setTimeline(sim.timeline.filter((step, idx) => idx <= sim.currentStep));
      }
    });

    return () => {
      newSocket?.disconnect();
    };
  }, []);

  const formatTime = (secs) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleExecute = async () => {
    if (!selectedScenario) return;

    try {
      const res = await apiClient.post('/chaos/start', {
        scenarioId: selectedScenario.id,
        intensity,
        recoveryTime
      });
      if (res.data.success) {
        setSimulation(res.data.data);
        setTimeline(res.data.data.timeline.slice(0, 1));
        setIsPlaying(true);
      }
    } catch (e) {
      console.error('Failed to start simulation:', e);
    }
  };

  const handleStop = async () => {
    try {
      await apiClient.post('/chaos/stop');
      setIsPlaying(false);
    } catch (e) {
      console.error('Failed to stop simulation:', e);
    }
  };

  const getIntensityLabel = (intensityVal) => {
    if (intensityVal < 30) return 'Minor';
    if (intensityVal < 75) return 'Severe';
    return 'Catastrophic';
  };

  return (
    <div className="flex flex-col h-full space-y-lg select-none">
      <div className="grid grid-cols-12 gap-lg flex-1 min-h-[500px]">
        {/* Scenario Builder (Left Panel) */}
        <div className="col-span-12 lg:col-span-3 bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.03)] justify-between">
          <div className="space-y-md">
            <div className="flex items-center justify-between mb-md">
              <h2 className="font-headline-sm text-headline-sm text-on-background">Scenario Builder</h2>
              <span className="material-symbols-outlined text-primary">tune</span>
            </div>
            
            <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Select Threat Vector</p>
            
            {/* Scenario Cards - Rendering all 20 scenarios */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
              {scenarios.map((scenario) => (
                <div 
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario)}
                  className={`cursor-pointer p-md border rounded-lg transition-all ${selectedScenario?.id === scenario.id ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary hover:bg-surface-container-low'}`}
                >
                  <div className="flex items-center gap-md mb-sm">
                    <span className={`material-symbols-outlined ${selectedScenario?.id === scenario.id ? 'text-primary' : 'text-secondary'}`}>
                      {scenario.category === 'AWS' ? 'cloud' :
                       scenario.category === 'Data' ? 'database' :
                       scenario.category === 'Kubernetes' ? 'dns' :
                       scenario.category === 'Container' ? 'inventory_2' :
                       scenario.category === 'Network' ? 'router' :
                       scenario.category === 'Resource' ? 'memory' :
                       scenario.category === 'Storage' ? 'storage' :
                       scenario.category === 'Security' ? 'security' :
                       scenario.category === 'Natural' ? 'public' :
                       'power'}
                    </span>
                    <span className={`font-body-md font-bold ${selectedScenario?.id === scenario.id ? 'text-primary' : 'text-on-surface'}`}>{scenario.name}</span>
                  </div>
                  <p className="font-body-sm text-secondary">Category: {scenario.category}</p>
                </div>
              ))}
            </div>

            {/* Control Panel in Left Panel */}
            <div className="pt-lg space-y-md">
              <div>
                <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-sm">Intensity Control: {intensity}% ({getIntensityLabel(intensity)})</p>
                <input 
                  className="w-full h-1.5 bg-secondary-container rounded-lg appearance-none cursor-pointer accent-primary" 
                  type="range" min="10" max="100"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                />
                <div className="flex justify-between mt-2">
                  <span className="font-label-sm text-secondary">Minor</span>
                  <span className="font-label-sm text-secondary">Catastrophic</span>
                </div>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-sm">Recovery Time Target: {recoveryTime}s</p>
                <input 
                  className="w-full h-1.5 bg-secondary-container rounded-lg appearance-none cursor-pointer accent-primary" 
                  type="range" min="60" max="600" step="60"
                  value={recoveryTime}
                  onChange={(e) => setRecoveryTime(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          <button 
            onClick={isPlaying ? handleStop : handleExecute}
            className={`mt-xl w-full py-md rounded-lg font-bold shadow-lg transition-all ${isPlaying ? 'bg-red-600 text-white hover:opacity-90 active:scale-[0.98]' : 'bg-primary text-on-primary shadow-primary/20 hover:opacity-90 active:scale-[0.98]'}`}
          >
            {isPlaying ? 'Stop Simulation' : 'Execute Simulation'}
          </button>
        </div>

        {/* Central Interactive Map & Timeline Panel (Middle Section) */}
        <div className="col-span-12 lg:col-span-5 bg-white border border-outline-variant rounded-xl relative overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)] min-h-[400px] flex flex-col">
          <div className="p-lg border-b border-outline-variant">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                {selectedScenario?.name || 'Select a scenario'}
              </h3>
              {simulation && (
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  simulation.phase === 'initial' ? 'bg-blue-100 text-blue-800' :
                  simulation.phase === 'detection' ? 'bg-amber-100 text-amber-800' :
                  simulation.phase === 'response' ? 'bg-orange-100 text-orange-800' :
                  simulation.phase === 'recovery' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-primary-fixed text-on-primary-fixed-variant'
                }`}>
                  {simulation.phase.toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <div className="flex-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-surface-container-low">
              <img className="w-full h-full object-cover grayscale opacity-60" alt="Metropolitan grid blueprint" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSb03J_UHxPuhqKaAN0IAtB3qS6r6advYpshigmpzaNUYIvMpknm4GYCPs8v9Wn4L-mN_atU0Cqt1u_bqFsU0_LVgjHi9xukIFQBYtbBhg6LYdDVbKciJR4kz7_VVp3d5CjwT4xuTKuYrv0Iy5kVnMwFLuOec87WWbWF0sD6sqTmz4NE2AHuxjy35h2ZIeru5njSCLjcjRuWKaqamMkIP2w4pIijmRhjxi6oYGNvVwJ-wVfh3EmSWKxDNxZOtQM_aOHgCEsgAWeg"/>
              {/* Overlay */}
              <div className="absolute top-lg right-lg bg-white/90 backdrop-blur-md p-md rounded-lg border border-outline-variant flex flex-col gap-sm">
                <div className="flex items-center gap-sm">
                  <div className={`w-3 h-3 rounded-full bg-primary ${isPlaying ? 'animate-pulse' : ''}`}></div>
                  <span className="font-label-md text-on-surface">Critical Zone A-1</span>
                </div>
                <div className="flex items-center gap-sm">
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  <span className="font-label-md text-on-surface">Stable Sector</span>
                </div>
              </div>
              {/* Data Visualization Layers */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600">
                <circle cx="400" cy="300" fill="rgba(173, 26, 108, 0.05)" r={String(100 + (intensity * 0.8))} stroke="rgba(173, 26, 108, 0.3)" strokeDasharray="8 4" strokeWidth="2"></circle>
                <circle cx="350" cy="280" fill="#ad1a6c" r="12"></circle>
                <circle cx="480" cy="350" fill="#ad1a6c" opacity="0.6" r="8"></circle>
                <path d="M350 280 L480 350" stroke="#ad1a6c" strokeDasharray="4 2" strokeWidth="1"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Panel - Metrics and Details */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-lg justify-between">
          {/* Infrastructure Health & RTO/RPO (Top Right Card) */}
          <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col">
            <div className="flex justify-between items-center mb-md">
              <h3 className="font-label-md text-label-md text-secondary uppercase font-bold">Infrastructure</h3>
              <span className={`font-headline-md ${infraHealth > 80 ? 'text-emerald-600' : infraHealth > 50 ? 'text-amber-600' : 'text-red-600'}`}>{Math.round(infraHealth)}%</span>
            </div>
            <div className="relative pt-lg flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle className="text-surface-container-highest" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
                <circle 
                  className="text-primary transition-all duration-1000" 
                  cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364.4" 
                  strokeDashoffset={364.4 - (364.4 * infraHealth) / 100}
                  strokeWidth="8"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-headline-md text-primary">{Math.round(infraHealth)}%</span>
              </div>
            </div>
            <div className="mt-lg grid grid-cols-2 gap-md text-center">
              <div className="p-sm bg-surface-container rounded-lg">
                <span className="font-label-sm text-secondary block">RTO (s)</span>
                <span className="font-headline-sm text-primary">{simulation?.rto || '0'}</span>
              </div>
              <div className="p-sm bg-surface-container rounded-lg">
                <span className="font-label-sm text-secondary block">RPO (s)</span>
                <span className="font-headline-sm text-primary">{simulation?.rpo || '0'}</span>
              </div>
            </div>
          </div>

          {/* Failed Services (Bottom Right Card) */}
          <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex-1">
            <h3 className="font-label-md text-label-md text-secondary uppercase font-bold mb-md">Failed Services</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
              {simulation?.failedServices && simulation.failedServices.length > 0 ? (
                simulation.failedServices.map((service, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-sm bg-red-50 border border-red-200 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="font-body-sm text-red-800">{service}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2 p-sm bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="font-body-sm text-emerald-800">All services stable</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Timeline Panel (Footer Panel) */}
      <footer className="bg-white border border-outline-variant rounded-xl p-lg shadow-[0_4px_12px_rgba(0,0,0,0.03)] shrink-0">
        <div className="flex items-center gap-md mb-md">
          <button 
            onClick={() => {}}
            className="p-2 bg-surface-container-high hover:bg-primary/10 rounded-full text-primary transition-all"
          >
            <span className="material-symbols-outlined">fast_rewind</span>
          </button>
          <button 
            onClick={() => {}}
            className="p-4 bg-primary text-on-primary rounded-full shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">play_arrow</span>
          </button>
          <button 
            onClick={() => {}}
            className="p-2 bg-surface-container-high hover:bg-primary/10 rounded-full text-primary transition-all"
          >
            <span className="material-symbols-outlined">fast_forward</span>
          </button>
          <div className="ml-4 font-label-md text-secondary">
            {simulation ? `Simulation Progress: ${formatTime(simulation.currentStep)} / ${formatTime(simulation.recoveryTime)}` : 'No active simulation'}
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto custom-scrollbar">
          {timeline.map((step, idx) => (
            <div key={idx} className={`flex-shrink-0 min-w-[150px] p-sm rounded-lg border ${
              step.status === 'alert' ? 'bg-red-50 border-red-200' :
              step.status === 'warning' ? 'bg-amber-50 border-amber-200' :
              step.status === 'in_progress' ? 'bg-blue-50 border-blue-200' :
              'bg-emerald-50 border-emerald-200'
            }`}>
              <div className="font-label-sm text-secondary">T+{step.time}s</div>
              <div className="font-body-sm font-medium">{step.event}</div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
