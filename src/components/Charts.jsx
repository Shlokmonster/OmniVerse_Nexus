import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { motion } from 'framer-motion';

export function MetricsLineChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <defs>
          <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#78716C' }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#78716C' }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E7E5E4', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
          cursor={{ stroke: '#6366F1', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        <Line
          type="monotone"
          dataKey="cpu"
          stroke="#6366F1"
          strokeWidth={2}
          dot={{ fill: '#6366F1', r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function MetricsAreaChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#78716C' }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#78716C' }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E7E5E4', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
        />
        <Area
          type="monotone"
          dataKey="memory"
          stroke="#10B981"
          strokeWidth={2}
          fill="url(#colorMemory)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function MetricsBarChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#78716C' }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#78716C' }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E7E5E4', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
        />
        <Bar dataKey="latency" fill="#F59E0B" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RealtimeMetricsChart() {
  const [data, setData] = useState([
    { time: '00:00', cpu: 40, memory: 50 },
    { time: '00:01', cpu: 45, memory: 55 },
    { time: '00:02', cpu: 42, memory: 53 },
    { time: '00:03', cpu: 50, memory: 58 },
    { time: '00:04', cpu: 48, memory: 60 },
    { time: '00:05', cpu: 55, memory: 62 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1];
        const newTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const newCpu = Math.max(10, Math.min(90, last.cpu + (Math.random() * 20 - 10)));
        const newMemory = Math.max(20, Math.min(95, last.memory + (Math.random() * 10 - 5)));
        
        return [...prev.slice(1), { time: newTime, cpu: Math.round(newCpu), memory: Math.round(newMemory) }];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorCpu2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
        <XAxis
          dataKey="time"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: '#78716C' }}
          dy={10}
        />
        <YAxis
          domain={[0, 100]}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: '#78716C' }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E7E5E4', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
        />
        <Area
          type="monotone"
          dataKey="cpu"
          stroke="#6366F1"
          strokeWidth={2}
          fill="url(#colorCpu2)"
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="memory"
          stroke="#10B981"
          strokeWidth={2}
          fill="transparent"
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
