import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  
  // Animated stats
  const [nodes, setNodes] = useState(0);
  const [accuracy, setAccuracy] = useState(90);
  const [latency, setLatency] = useState(100);

  useEffect(() => {
    // Animate stats values on load
    const duration = 2000;
    const steps = 60;
    const intervalTime = duration / steps;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      const progress = stepCount / steps;
      
      setNodes((progress * 1.2).toFixed(1));
      setAccuracy((90 + progress * 9.999).toFixed(3));
      setLatency(Math.floor(100 - progress * 85));

      if (stepCount >= steps) {
        clearInterval(timer);
        setNodes(1.2);
        setAccuracy(99.999);
        setLatency(15);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col justify-between selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* TopNavBar */}
      <header className="flex justify-between items-center w-full px-lg h-16 sticky top-0 z-50 bg-surface-container-lowest border-b border-outline-variant">
        <div className="flex items-center gap-md">
          <span className="text-headline-sm font-headline-sm font-bold text-primary">OmniVerse Nexus</span>
        </div>
        <nav className="hidden md:flex items-center gap-xl">
          <span className="font-label-md text-label-md text-primary border-b-2 border-primary py-xs cursor-pointer">Home</span>
          <span className="font-label-md text-label-md text-secondary hover:bg-surface-container transition-colors px-sm py-xs rounded-lg cursor-pointer" onClick={() => navigate('/login')}>Simulation</span>
          <span className="font-label-md text-label-md text-secondary hover:bg-surface-container transition-colors px-sm py-xs rounded-lg cursor-pointer" onClick={() => navigate('/login')}>Infrastructure</span>
          <span className="font-label-md text-label-md text-secondary hover:bg-surface-container transition-colors px-sm py-xs rounded-lg cursor-pointer">Docs</span>
        </nav>
        <div className="flex items-center gap-md">
          <button className="material-symbols-outlined text-secondary hover:bg-surface-container p-sm rounded-full transition-colors">notifications</button>
          <button className="material-symbols-outlined text-secondary hover:bg-surface-container p-sm rounded-full transition-colors" onClick={() => navigate('/login')}>account_circle</button>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="max-w-[1200px] mx-auto px-lg md:px-xl flex-grow">
        {/* Hero Section */}
        <section className="py-2xl md:py-3xl flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-xs px-md py-xs bg-primary-fixed rounded-full mb-lg">
            <span className="material-symbols-outlined text-[16px] text-primary">auto_awesome</span>
            <span className="font-label-sm text-label-sm text-on-primary-fixed">v4.2.0 Civil Engines now live</span>
          </div>
          <h1 className="font-display text-display text-on-surface mb-md max-w-4xl">
            The World's Digital Twin. <span className="text-primary">Simulated.</span>
          </h1>
          <p className="font-body-lg text-body-lg text-secondary max-w-2xl mb-xl">
            Deploy enterprise-grade civilization simulations with unprecedented fidelity. OmniVerse Nexus enables predictive modeling for global systems, from infrastructure health to climate resilience.
          </p>
          <div className="flex flex-col sm:flex-row gap-md">
            <button className="bg-primary text-on-primary font-label-md text-label-md px-xl py-md rounded-lg hover:opacity-90 transition-opacity flex items-center gap-sm" onClick={() => navigate('/login')}>
              Request Access
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button className="bg-surface text-primary border border-outline-variant font-label-md text-label-md px-xl py-md rounded-lg hover:bg-surface-container transition-colors">
              View Docs
            </button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-lg py-xl border-y border-outline-variant mb-3xl">
          <div className="flex flex-col items-center justify-center p-xl">
            <span className="font-display text-[40px] text-primary stat-glow">{nodes}B</span>
            <span className="font-label-md text-label-md text-secondary uppercase tracking-widest mt-xs">Active Nodes</span>
          </div>
          <div className="flex flex-col items-center justify-center p-xl border-x border-outline-variant">
            <span className="font-display text-[40px] text-primary stat-glow">{accuracy}%</span>
            <span className="font-label-md text-label-md text-secondary uppercase tracking-widest mt-xs">Sim Accuracy</span>
          </div>
          <div className="flex flex-col items-center justify-center p-xl">
            <span className="font-display text-[40px] text-primary stat-glow">{latency}ms</span>
            <span className="font-label-md text-label-md text-secondary uppercase tracking-widest mt-xs">Global Latency</span>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="mb-3xl">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xl text-center">System Domains</h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
            {/* Infrastructure Health */}
            <div className="md:col-span-8 bg-surface-container-lowest p-xl rounded-xl sharp-border notion-shadow flex flex-col justify-between group hover:border-primary transition-colors cursor-default">
              <div>
                <span className="material-symbols-outlined text-primary mb-md">account_tree</span>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-sm">Infrastructure Health</h3>
                <p className="font-body-md text-body-md text-secondary max-w-lg">Monitor and predict structural decay in critical energy grids and transportation networks with millimeter precision.</p>
              </div>
              <div className="mt-xl h-48 w-full rounded-lg overflow-hidden border border-outline-variant relative">
                <img className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" alt="Metropolitan power grid visualization" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCI_0MZaHzPX3ukwmb6K9vKoCRDrMxM-1Bv4L_We0a2edvxyfly-K8tiTUuqwT4w_GxrQBd27Z6_Y1Jl3Pa7dNfaTWx-1Z8tQD6RaElCTWn_Nx5CeKNB2Lp-0g5kWqXtZVyi4B1_WZnSPEwJRE5sE0-pHENRpHqnRCeKLHFnSubb1i-DDu8aY3W7EsQzm2dN1yMIFj5qQykLlU190x92jo2f_-DdLc6cZ3lWpSfpk2zgQ8HJyEXxKSnnFzEiEyfJblseo-OsWXwfQ"/>
              </div>
            </div>
            {/* Global Security */}
            <div className="md:col-span-4 bg-surface-container-lowest p-xl rounded-xl sharp-border notion-shadow flex flex-col justify-between hover:border-primary transition-colors cursor-default">
              <div>
                <span className="material-symbols-outlined text-primary mb-md">security</span>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-sm">Global Security</h3>
                <p className="font-body-md text-body-md text-secondary">Real-time threat detection and mitigation across decentralized data silos.</p>
              </div>
              <div className="mt-lg">
                <ul className="space-y-sm">
                  <li className="flex items-center gap-sm font-label-md text-label-md text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                    Quantum Encryption
                  </li>
                  <li className="flex items-center gap-sm font-label-md text-label-md text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                    Zero-Trust Access
                  </li>
                  <li className="flex items-center gap-sm font-label-md text-label-md text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                    AI Boundary Shields
                  </li>
                </ul>
              </div>
            </div>
            {/* Climate Forecasting */}
            <div className="md:col-span-4 bg-surface-container-lowest p-xl rounded-xl sharp-border notion-shadow flex flex-col justify-between hover:border-primary transition-colors cursor-default">
              <div>
                <span className="material-symbols-outlined text-primary mb-md">thermostat</span>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-sm">Climate Forecasting</h3>
                <p className="font-body-md text-body-md text-secondary">Advanced atmospheric simulation for 50-year predictive modeling.</p>
              </div>
              <div className="mt-lg h-32 bg-surface-container rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-[48px] text-outline-variant">waves</span>
              </div>
            </div>
            {/* Supply Chain Resilience */}
            <div className="md:col-span-8 bg-surface-container-lowest p-xl rounded-xl sharp-border notion-shadow flex items-center gap-xl group hover:border-primary transition-colors cursor-default">
              <div className="flex-1">
                <span className="material-symbols-outlined text-primary mb-md">inventory_2</span>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-sm">Supply Chain Resilience</h3>
                <p className="font-body-md text-body-md text-secondary">Dynamic routing and automated resource allocation during global disruption events.</p>
              </div>
              <div className="hidden sm:block w-1/3 h-full min-h-[200px] rounded-lg overflow-hidden border border-outline-variant">
                <img className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" alt="Supply chain visualization" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjgIiTQKo6zbuLJB3akSgYQCc5SUsca0y3HCNGdgRtxZvuhFsIr5PiDm25FmcaoU-5GF2dGdUaVarUHiG7xegmy2eUaW9bqcUKcP7lJ14Erk7DJNEFlANVuDzk9cd0cm_rdb4gWHzbK5DUrBAVeBCK0LCy-65NcXooxWfvFAvNIx8MmnGrJOB9BlNJ8nr9pg0Q9uDTMQviZBZAiStib8ydtTGHWYsgjl5MWUkNlTIygWgKL6yf_1weEuMxuBnzVJvU3Mh7V3A1Lg"/>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary-container p-2xl md:p-3xl rounded-xl flex flex-col items-center text-center mb-3xl">
          <h2 className="font-headline-lg text-headline-lg text-on-primary-container mb-md">Ready to simulate the future?</h2>
          <p className="font-body-lg text-body-lg text-on-primary-container/80 max-w-xl mb-xl">
            Join 500+ government agencies and Fortune 100 enterprises building the next generation of digital infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row gap-md">
            <button className="bg-on-primary-container text-primary font-headline-sm text-headline-sm px-2xl py-md rounded-lg hover:opacity-90 transition-opacity" onClick={() => navigate('/login')}>
              Get Started
            </button>
            <button className="border border-on-primary-container text-on-primary-container font-headline-sm text-headline-sm px-2xl py-md rounded-lg hover:bg-on-primary-container/10 transition-colors">
              Talk to Sales
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-xl px-lg md:px-xl flex flex-col md:flex-row justify-between items-center border-t border-outline-variant bg-surface-container-lowest">
        <div className="flex flex-col items-center md:items-start gap-xs mb-md md:mb-0">
          <span className="text-label-sm font-bold text-primary">OmniVerse Nexus</span>
          <p className="font-label-sm text-label-sm text-secondary">© 2024 OmniVerse Nexus. All rights reserved.</p>
        </div>
        <div className="flex gap-xl">
          <span className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors cursor-pointer">Privacy Policy</span>
          <span className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors cursor-pointer">Terms of Service</span>
          <span className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors cursor-pointer">Status</span>
        </div>
        <div className="flex gap-md mt-md md:mt-0">
          <button className="material-symbols-outlined text-secondary hover:text-primary transition-colors">language</button>
          <button className="material-symbols-outlined text-secondary hover:text-primary transition-colors">terminal</button>
        </div>
      </footer>
    </div>
  );
}
