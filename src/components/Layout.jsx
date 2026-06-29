import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import CommandPalette from './CommandPalette.jsx';
import StatusBadge from './ui/StatusBadge.jsx';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('nexus_user') || '{"name":"Admin User","role":"Operator"}');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsConnected(true);
    const handleOffline = () => setIsConnected(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_user');
    navigate('/login');
  };

  const navLinks = [
    { to: '/overview', label: 'Dashboards', icon: 'dashboard' },
    { to: '/simulation', label: 'Simulation', icon: 'biotech' },
    { to: '/infrastructure', label: 'Infrastructure', icon: 'account_tree' },
    { to: '/settings', label: 'Settings', icon: 'settings' }
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* SideNavBar - Desktop */}
      <aside className="flex flex-col h-full border-r border-outline-variant bg-surface p-md w-64 hidden md:flex shrink-0">
        <div className="mb-xl px-sm">
          <div className="font-headline-sm text-headline-sm font-bold text-primary">OmniVerse</div>
          <div className="font-label-md text-label-md text-secondary">Digital Twin Admin</div>
        </div>
        <nav className="flex-1 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-sm py-2 rounded-lg transition-all ${
                  isActive
                    ? 'text-primary font-bold bg-surface-container-high scale-[0.98]'
                    : 'text-secondary hover:bg-surface-container-high'
                }`
              }
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              <span className="font-label-md text-label-md">{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-md border-t border-outline-variant space-y-1">
          <div className="px-sm mb-2">
            <StatusBadge status={isConnected ? 'healthy' : 'offline'} label={isConnected ? 'System Online' : 'System Offline'} />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-sm py-2 w-full text-left text-secondary hover:bg-surface-container-high rounded-lg transition-all"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md text-label-md">Logout</span>
          </button>
          <div className="flex items-center gap-3 mt-4 px-sm pt-2">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-xs font-bold">
              {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'JD'}
            </div>
            <div className="overflow-hidden">
              <p className="font-label-md text-label-md truncate">{user.name || 'Admin User'}</p>
              <p className="text-[10px] text-secondary truncate">{user.role || 'Operator'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TopNavBar */}
        <header className="flex justify-between items-center w-full px-lg h-16 bg-surface-container-lowest border-b border-outline-variant shrink-0">
          <div className="flex items-center gap-md">
            <span 
              className="md:hidden material-symbols-outlined text-primary cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              menu
            </span>
            <span className="text-headline-sm font-headline-sm font-bold text-primary">OmniVerse Nexus</span>
          </div>
          <div className="flex items-center gap-xl">
            <div className="hidden sm:flex items-center gap-lg">
              <nav className="flex gap-md h-16">
                <NavLink to="/overview" className={({ isActive }) => `flex items-center px-2 font-label-md text-label-md ${isActive ? 'text-primary border-b-2 border-primary' : 'text-secondary'}`}>Overview</NavLink>
                <NavLink to="/simulation" className={({ isActive }) => `flex items-center px-2 font-label-md text-label-md ${isActive ? 'text-primary border-b-2 border-primary' : 'text-secondary'}`}>Simulation</NavLink>
                <NavLink to="/infrastructure" className={({ isActive }) => `flex items-center px-2 font-label-md text-label-md ${isActive ? 'text-primary border-b-2 border-primary' : 'text-secondary'}`}>Infrastructure</NavLink>
              </nav>
            </div>
            <div className="flex items-center gap-md">
              <CommandPalette />
              <button className="p-2 text-secondary hover:bg-surface-container transition-colors rounded-full">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="p-2 text-secondary hover:bg-surface-container transition-colors rounded-full" onClick={() => navigate('/settings')}>
                <span className="material-symbols-outlined">account_circle</span>
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-surface border-b border-outline-variant z-40 p-md flex flex-col space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-sm py-2 rounded-lg ${
                    isActive ? 'text-primary bg-surface-container-high' : 'text-secondary'
                  }`
                }
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                <span className="font-label-md text-label-md">{link.label}</span>
              </NavLink>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 px-sm py-2 text-left text-secondary hover:bg-surface-container-high rounded-lg"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="font-label-md text-label-md">Logout</span>
            </button>
          </div>
        )}

        {/* Dynamic Page Router Outlet */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-lg bg-background">
          {children}
        </div>
      </main>
    </div>
  );
}
