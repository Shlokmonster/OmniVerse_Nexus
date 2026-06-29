import React from 'react';
import { motion } from 'framer-motion';
import { Box } from 'lucide-react';

export default function EmptyState({ title = "No data found", description = "Try adjusting your filters or check back later", icon: Icon = Box }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <motion.div
        className="mb-6 p-6 rounded-2xl bg-surface-container"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Icon className="w-12 h-12 text-gray-400" />
      </motion.div>
      <h3 className="text-lg font-semibold text-on-background mb-2">{title}</h3>
      <p className="text-secondary text-sm max-w-xs">{description}</p>
    </div>
  );
}
