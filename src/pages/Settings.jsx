import React, { useState } from 'react';

export default function Settings() {
  const user = JSON.parse(localStorage.getItem('nexus_user') || '{"name":"Jane Doe","email":"admin@omniverse.nexus","role":"Admin","organization":"Nexus Operations Group"}');
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'Default Telemetry Key', key: 'ov_nexus_live_729486c...11a', createdAt: '2026-06-15' }
  ]);
  const [integrations, setIntegrations] = useState([
    { name: 'HashiCorp Vault', description: 'Centralized secrets encryption management', connected: true },
    { name: 'Prometheus Telemetry Scraper', description: 'Container metrics collection routing', connected: true },
    { name: 'Grafana Dashboard Feeds', description: 'Visual analytical display rendering', connected: false }
  ]);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, name, email };
    localStorage.setItem('nexus_user', JSON.stringify(updatedUser));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleGenerateKey = () => {
    const randomHex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newKey = {
      id: Date.now(),
      name: `API Client Key ${apiKeys.length + 1}`,
      key: `ov_nexus_live_${randomHex.substring(0, 10)}...${randomHex.substring(20)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setApiKeys([...apiKeys, newKey]);
  };

  const handleToggleIntegration = (index) => {
    setIntegrations(prev => prev.map((item, idx) => 
      idx === index ? { ...item, connected: !item.connected } : item
    ));
  };

  return (
    <div className="space-y-lg max-w-[900px] mx-auto select-none">
      <div className="border-b border-outline-variant pb-md mb-md">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Settings</h1>
        <p className="font-body-sm text-secondary">Manage credentials, API scopes, and third-party infrastructure integrations.</p>
      </div>

      {isSaved && (
        <div className="p-sm text-xs bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-300/30 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>Profile configuration saved successfully.</span>
        </div>
      )}

      {/* Profile Form */}
      <section className="bg-white border border-outline-variant p-lg rounded-xl shadow-sm">
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-lg">Personal Information</h3>
        <form onSubmit={handleSaveProfile} className="space-y-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-secondary" htmlFor="user-name">Full Name</label>
              <input 
                id="user-name"
                className="w-full px-md py-sm bg-surface border border-outline-variant rounded-lg font-body-md text-body-md focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-secondary" htmlFor="user-email">Email Address</label>
              <input 
                id="user-email"
                className="w-full px-md py-sm bg-surface border border-outline-variant rounded-lg font-body-md text-body-md focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div>
              <span className="font-label-sm text-secondary block">Assigned Role</span>
              <span className="font-body-md font-bold mt-1 block">{user.role || 'Operator'}</span>
            </div>
            <div>
              <span className="font-label-sm text-secondary block">Organization</span>
              <span className="font-body-md font-bold mt-1 block">{user.organization || 'Operations Group'}</span>
            </div>
          </div>
          <button 
            type="submit"
            className="px-lg py-md bg-[#D53F8C] hover:bg-[#B8327B] text-white rounded-lg font-label-md text-label-md transition-all active:scale-[0.98]"
          >
            Save Changes
          </button>
        </form>
      </section>

      {/* API Keys */}
      <section className="bg-white border border-outline-variant p-lg rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-lg">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">API Credentials</h3>
            <p className="font-body-sm text-secondary">Token credentials to authenticate telemetry scripts with EKS nodes.</p>
          </div>
          <button 
            onClick={handleGenerateKey}
            className="px-md py-sm bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity active:scale-[0.98]"
          >
            Generate Key
          </button>
        </div>
        <div className="divide-y divide-outline-variant">
          {apiKeys.map((k) => (
            <div key={k.id} className="py-md flex justify-between items-center">
              <div>
                <p className="font-label-md text-label-md font-semibold text-on-surface">{k.name}</p>
                <code className="text-xs bg-surface-container px-sm py-0.5 rounded text-primary mt-1 inline-block">{k.key}</code>
              </div>
              <div className="text-right">
                <span className="font-label-sm text-secondary text-xs block">Created: {k.createdAt}</span>
                <button 
                  onClick={() => setApiKeys(prev => prev.filter(item => item.id !== k.id))}
                  className="text-xs text-error font-semibold hover:underline mt-1"
                >
                  Revoke Key
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Integrations */}
      <section className="bg-white border border-outline-variant p-lg rounded-xl shadow-sm">
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-lg">Systems Integration</h3>
        <div className="divide-y divide-outline-variant">
          {integrations.map((item, index) => (
            <div key={item.name} className="py-md flex justify-between items-center">
              <div>
                <p className="font-label-md text-label-md font-semibold text-on-surface">{item.name}</p>
                <p className="font-body-sm text-secondary text-xs">{item.description}</p>
              </div>
              <button 
                onClick={() => handleToggleIntegration(index)}
                className={`px-md py-sm font-label-sm text-label-sm rounded-lg border transition-all ${
                  item.connected 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                    : 'bg-surface text-secondary border-outline-variant hover:bg-surface-container'
                }`}
              >
                {item.connected ? 'Connected' : 'Disconnect'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
