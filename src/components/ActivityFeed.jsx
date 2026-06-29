import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, AlertTriangle, Check, Wifi, Zap, Database } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const mockActivities = [
  { id: 1, type: 'success', icon: Check, title: 'Deployment successful', message: 'Frontend v2.4.1 deployed to production', time: new Date(Date.now() - 1000 * 60 * 2) },
  { id: 2, type: 'warning', icon: AlertTriangle, title: 'High CPU usage', message: 'Worker node 3 at 85% CPU', time: new Date(Date.now() - 1000 * 60 * 5) },
  { id: 3, type: 'info', icon: Server, title: 'New instance created', message: 'EC2 instance i-1234abcd started', time: new Date(Date.now() - 1000 * 60 * 10) },
  { id: 4, type: 'success', icon: Database, title: 'Backup completed', message: 'PostgreSQL backup successful', time: new Date(Date.now() - 1000 * 60 * 30) },
  { id: 5, type: 'error', icon: Wifi, title: 'Network blip', message: 'AZ us-west-2b had 2s latency spike', time: new Date(Date.now() - 1000 * 60 * 45) },
];

export default function ActivityFeed() {
  const [activities, setActivities] = useState(mockActivities);

  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        type: ['success', 'warning', 'info', 'error'][Math.floor(Math.random() * 4)],
        icon: [Check, AlertTriangle, Server, Zap][Math.floor(Math.random() * 4)],
        title: 'New activity detected',
        message: 'System event logged',
        time: new Date(),
      };
      setActivities((prev) => [newActivity, ...prev].slice(0, 8));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getColor = (type) => {
    switch (type) {
      case 'success': return 'text-emerald-500 bg-emerald-50';
      case 'warning': return 'text-amber-500 bg-amber-50';
      case 'error': return 'text-red-500 bg-red-50';
      default: return 'text-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4 p-3 rounded-xl bg-surface hover:bg-surface-container transition-colors"
          >
            <div className={`p-2 rounded-lg ${getColor(activity.type)}`}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-medium text-on-background truncate">{activity.title}</h4>
                <span className="text-xs text-secondary whitespace-nowrap">
                  {formatDistanceToNow(activity.time, { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-secondary mt-0.5">{activity.message}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
