import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Home, Server, AlertTriangle, Settings, Zap } from 'lucide-react';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const commands = [
    { id: 1, label: 'Go to Overview', icon: Home, path: '/overview' },
    { id: 2, label: 'Go to Infrastructure', icon: Server, path: '/infrastructure' },
    { id: 3, label: 'Run Simulation', icon: Zap, path: '/simulation' },
    { id: 4, label: 'View Alerts', icon: AlertTriangle, path: '/overview' },
    { id: 5, label: 'Go to Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface border border-outline-variant text-secondary text-sm hover:border-primary transition-colors"
      >
        <Search className="w-4 h-4" />
        <span>Search</span>
        <div className="flex items-center gap-0.5 ml-2">
          <kbd className="px-1.5 py-0.5 rounded-md bg-surface-container text-[10px] font-medium">⌘</kbd>
          <kbd className="px-1.5 py-0.5 rounded-md bg-surface-container text-[10px] font-medium">K</kbd>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-[101] w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-outline-variant overflow-hidden"
            >
              <div className="p-4 border-b border-outline-variant">
                <div className="flex items-center gap-3 px-3 py-2.5 bg-surface rounded-lg">
                  <Search className="w-5 h-5 text-secondary" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type a command or search..."
                    className="flex-1 bg-transparent border-none outline-none text-on-background"
                  />
                </div>
              </div>
              <div className="p-2 max-h-[400px] overflow-y-auto">
                {commands.map((command) => (
                  <button
                    key={command.id}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-container text-left transition-colors"
                    onClick={() => {
                      setIsOpen(false);
                      window.location.href = command.path;
                    }}
                  >
                    <command.icon className="w-5 h-5 text-secondary" />
                    <span className="text-on-background font-medium">{command.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
