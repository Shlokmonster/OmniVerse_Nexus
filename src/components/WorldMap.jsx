import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Server, Database, Cloud, Shield } from 'lucide-react';

const locations = [
  { id: 'us-east', x: 58, y: 30, name: 'US East', status: 'healthy', type: 'cloud' },
  { id: 'us-west', x: 20, y: 35, name: 'US West', status: 'warning', type: 'server' },
  { id: 'eu-west', x: 50, y: 25, name: 'EU West', status: 'healthy', type: 'database' },
  { id: 'ap-northeast', x: 85, y: 35, name: 'Tokyo', status: 'healthy', type: 'server' },
  { id: 'ap-south', x: 78, y: 50, name: 'Mumbai', status: 'critical', type: 'cloud' },
  { id: 'sa-east', x: 40, y: 68, name: 'São Paulo', status: 'healthy', type: 'database' },
];

const statusColors = {
  healthy: '#10B981',
  warning: '#F59E0B',
  critical: '#EF4444',
};

export default function WorldMap() {
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        setDimensions({
          width: svgRef.current.parentElement.clientWidth,
          height: 300,
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'cloud': return Cloud;
      case 'server': return Server;
      case 'database': return Database;
      default: return Shield;
    }
  };

  return (
    <div className="relative w-full h-[300px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden border border-outline-variant">
      <svg
        ref={svgRef}
        viewBox="0 0 100 60"
        className="w-full h-full opacity-60"
      >
        <path
          d="M10,30 Q20,10 35,25 Q50,20 65,30 Q80,40 90,35 Q95,25 90,30 Q85,40 75,35 Q60,30 50,35 Q35,40 25,35 Q15,30 10,30Z"
          fill="#CBD5E1"
        />
        <path
          d="M40,5 Q50,10 55,20 Q45,25 40,30 Q30,25 35,15 Z"
          fill="#CBD5E1"
        />
        <path
          d="M70,15 Q80,20 85,30 Q75,35 70,30 Q65,25 70,15Z"
          fill="#CBD5E1"
        />
      </svg>

      {locations.map((loc) => {
        const Icon = getIcon(loc.type);
        return (
          <div
            key={loc.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
          >
            <motion.div
              className="relative"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
            >
              <div
                className="absolute -inset-3 rounded-full opacity-30"
                style={{
                  backgroundColor: statusColors[loc.status],
                  animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                }}
              />
              <div className="p-2 bg-white rounded-full shadow-lg border border-outline-variant">
                <Icon className="w-5 h-5" style={{ color: statusColors[loc.status] }} />
              </div>
            </motion.div>
            <div className="mt-2 bg-white px-2 py-1 rounded-md shadow-sm text-xs font-medium text-on-background border border-outline-variant whitespace-nowrap">
              {loc.name}
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
