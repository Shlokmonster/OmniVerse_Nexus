
import { infrastructureService } from './InfrastructureService.js';

const ALL_SCENARIOS = [
  // AWS/Infrastructure
  { id: 'aws-region-failure', name: 'AWS Region Failure', category: 'AWS', severity: 'critical' },
  { id: 'aws-az-failure', name: 'Availability Zone Failure', category: 'AWS', severity: 'critical' },
  { id: 'ec2-failure', name: 'EC2 Failure', category: 'AWS', severity: 'high' },
  { id: 'database-failure', name: 'Database Failure', category: 'Data', severity: 'critical' },
  { id: 'redis-failure', name: 'Redis Failure', category: 'Data', severity: 'high' },
  
  // Kubernetes/Container
  { id: 'node-failure', name: 'Node Failure', category: 'Kubernetes', severity: 'high' },
  { id: 'pod-crash', name: 'Pod Crash', category: 'Kubernetes', severity: 'medium' },
  { id: 'container-crash', name: 'Container Crash', category: 'Container', severity: 'medium' },
  
  // Network/Resource
  { id: 'network-failure', name: 'Network Failure', category: 'Network', severity: 'critical' },
  { id: 'high-cpu', name: 'High CPU', category: 'Resource', severity: 'medium' },
  { id: 'high-memory', name: 'High Memory', category: 'Resource', severity: 'medium' },
  { id: 'disk-failure', name: 'Disk Failure', category: 'Storage', severity: 'critical' },
  
  // Security
  { id: 'cyber-attack', name: 'Cyber Attack', category: 'Security', severity: 'critical' },
  { id: 'ddos', name: 'DDoS', category: 'Security', severity: 'critical' },
  
  // Natural Disasters
  { id: 'flood', name: 'Flood', category: 'Natural', severity: 'critical' },
  { id: 'earthquake', name: 'Earthquake', category: 'Natural', severity: 'critical' },
  { id: 'wildfire', name: 'Wildfire', category: 'Natural', severity: 'critical' },
  { id: 'pandemic', name: 'Pandemic', category: 'Natural', severity: 'high' },
  
  // Utility
  { id: 'power-failure', name: 'Power Failure', category: 'Utility', severity: 'critical' }
];

class ChaosSimulationService {
  constructor() {
    this.activeSimulation = null;
    this.simulationHistory = [];
    this.simulationInterval = null;
  }

  getAllScenarios() {
    return ALL_SCENARIOS;
  }

  startSimulation(scenarioId, intensity = 50, recoveryTime = 180) { // recovery in seconds
    if (this.activeSimulation) {
      return { error: 'Simulation already active' };
    }

    const scenario = ALL_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) {
      return { error: 'Scenario not found' };
    }

    this.activeSimulation = {
      id: Date.now().toString(),
      scenario,
      intensity,
      recoveryTime,
      startTime: new Date(),
      phase: 'initial',
      progress: 0,
      timeline: this.generateTimeline(scenario, intensity, recoveryTime),
      failedServices: this.getInitialFailedServices(scenario),
      rto: recoveryTime, // Estimated RTO in seconds
      rpo: Math.floor(intensity / 10) * 60, // Estimated RPO in seconds
      currentStep: 0
    };

    this.simulationHistory.push(this.activeSimulation);

    // Start simulation loop
    this.startSimulationLoop();

    return { simulation: this.activeSimulation };
  }

  getInitialFailedServices(scenario) {
    switch (scenario.category) {
      case 'AWS': return ['eks-cluster', 'alb', 's3'];
      case 'Data': return ['postgres', 'redis'];
      case 'Kubernetes': return ['simulation-engine', 'websocket-gateway'];
      case 'Container': return ['omniverse-backend'];
      case 'Network': return ['network-lb', 'dns'];
      case 'Resource': return ['ec2-worker-1', 'ec2-worker-2'];
      case 'Storage': return ['ebs-volumes'];
      case 'Security': return ['waf', 'vault'];
      case 'Natural': return ['power-grid', 'data-center'];
      case 'Utility': return ['ups', 'generator'];
      default: return ['generic-service'];
    }
  }

  generateTimeline(scenario, intensity, recoveryTime) {
    const steps = [];
    const phase1Duration = Math.floor(recoveryTime * 0.1); // Detection
    const phase2Duration = Math.floor(recoveryTime * 0.3); // Response
    const phase3Duration = Math.floor(recoveryTime * 0.4); // Recovery
    const phase4Duration = recoveryTime - phase1Duration - phase2Duration - phase3Duration; // Validation

    steps.push({ time: 0, phase: 'initial', event: 'Failure detected', status: 'alert' });
    
    for (let i = 1; i <= phase1Duration; i++) {
      steps.push({ time: i, phase: 'detection', event: 'Analyzing impact', status: 'warning' });
    }
    
    steps.push({ time: phase1Duration + 1, phase: 'response', event: 'Incident response activated', status: 'alert' });
    for (let i = phase1Duration + 2; i <= phase1Duration + phase2Duration; i++) {
      steps.push({ time: i, phase: 'response', event: 'Mitigating issue', status: 'in_progress' });
    }
    
    steps.push({ time: phase1Duration + phase2Duration + 1, phase: 'recovery', event: 'Starting recovery', status: 'in_progress' });
    for (let i = phase1Duration + phase2Duration + 2; i <= phase1Duration + phase2Duration + phase3Duration; i++) {
      steps.push({ time: i, phase: 'recovery', event: 'Restoring services', status: 'in_progress' });
    }
    
    steps.push({ time: recoveryTime - phase4Duration, phase: 'validation', event: 'Validating recovery', status: 'in_progress' });
    steps.push({ time: recoveryTime, phase: 'complete', event: 'Recovery complete', status: 'success' });
    
    return steps;
  }

  startSimulationLoop() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }

    this.simulationInterval = setInterval(() => {
      if (!this.activeSimulation) {
        clearInterval(this.simulationInterval);
        return;
      }

      // Update simulation progress
      const elapsedSeconds = Math.floor((new Date() - this.activeSimulation.startTime) / 1000);
      const progress = Math.min(100, (elapsedSeconds / this.activeSimulation.recoveryTime) * 100);
      this.activeSimulation.progress = progress;
      this.activeSimulation.currentStep = elapsedSeconds;

      // Update timeline phase
      if (elapsedSeconds >= this.activeSimulation.recoveryTime) {
        this.activeSimulation.phase = 'complete';
        this.activeSimulation.failedServices = [];
        clearInterval(this.simulationInterval);
      } else if (elapsedSeconds >= this.activeSimulation.recoveryTime * 0.8) {
        this.activeSimulation.phase = 'validation';
        this.activeSimulation.failedServices = this.activeSimulation.failedServices.slice(0, 1);
      } else if (elapsedSeconds >= this.activeSimulation.recoveryTime * 0.4) {
        this.activeSimulation.phase = 'recovery';
        this.activeSimulation.failedServices = this.activeSimulation.failedServices.slice(0, Math.ceil(this.activeSimulation.failedServices.length * 0.5));
      } else if (elapsedSeconds >= this.activeSimulation.recoveryTime * 0.1) {
        this.activeSimulation.phase = 'response';
      } else {
        this.activeSimulation.phase = 'detection';
      }

      // Update infrastructure data to reflect simulation
      const infra = infrastructureService.getData();
      infra.infrastructureHealth = Math.max(20, 100 - (this.activeSimulation.intensity * (100 - this.activeSimulation.progress) / 100));
      
      // Emit event for socket
      if (global.io) {
        global.io.emit('chaos-simulation-update', this.activeSimulation);
      }
    }, 1000);
  }

  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }
    const stopped = this.activeSimulation;
    this.activeSimulation = null;
    return stopped;
  }

  getActiveSimulation() {
    return this.activeSimulation;
  }

  getSimulationHistory() {
    return this.simulationHistory;
  }
}

export const chaosSimulationService = new ChaosSimulationService();
