import React, { useEffect, useState } from 'react';
import { getSocket, connectSocket } from '../services/socketClient.js';
import { apiClient } from '../services/apiClient.js';
import DataTable from '../components/DataTable.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import AnimatedNumber from '../components/ui/AnimatedNumber.jsx';
import ActivityFeed from '../components/ActivityFeed.jsx';
import { motion } from 'framer-motion';

export default function Infrastructure() {
  const [infraData, setInfraData] = useState(null);
  const [scalingEvents, setScalingEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [infraRes, scalingRes] = await Promise.all([
        apiClient.get('/infrastructure'),
        apiClient.get('/scaling-events')
      ]);
      if (infraRes.data.success) {
        setInfraData(infraRes.data.data);
      }
      if (scalingRes.data.success) {
        setScalingEvents(scalingRes.data.data);
      }
    } catch (e) {
      console.error('Failed to fetch data', e);
    }
  };

  useEffect(() => {
    fetchData();

    const socket = connectSocket();
    if (socket) {
      socket.on('infrastructure:init', (data) => setInfraData(data));
      socket.on('infrastructure:update', (data) => setInfraData(data));
    }

    return () => {
      if (socket) {
        socket.off('infrastructure:init');
        socket.off('infrastructure:update');
      }
    };
  }, []);

  const handleScalePod = async (serviceName, actionType) => {
    setLoading(true);
    try {
      await apiClient.post('/scaling-events', {
        serviceName,
        actionType,
        count: 1
      });
      await fetchData();
    } catch (e) {
      console.error('Failed to log scaling action', e);
    } finally {
      setLoading(false);
    }
  };
  
  if (!infraData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary">Loading Infrastructure Dashboard...</p>
        </div>
      </div>
    );
  }

  const podData = infraData.kubernetes.pods.map(pod => ({
    id: pod.name,
    podName: pod.name,
    status: pod.status,
    cpu: pod.cpu,
    memory: pod.memory,
    age: pod.age
  }));

  const podColumns = [
    { key: 'podName', label: 'Pod Name', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (val) => (
        <StatusBadge status={val === 'Running' ? 'healthy' : 'warning'} label={val} />
      )
    },
    { key: 'cpu', label: 'CPU', sortable: true },
    { key: 'memory', label: 'Memory', sortable: true },
    { key: 'age', label: 'Age', sortable: true },
  ];

  const metrics = [
    { label: 'EKS Nodes', value: infraData.aws.ec2.activeInstances, suffix: ' Active' },
    { label: 'CPU Load', value: infraData.metrics.cpu, suffix: '%' },
    { label: 'Memory', value: infraData.metrics.memory, suffix: '%' },
    { label: 'Latency', value: infraData.metrics.latency, suffix: 'ms' },
    { label: 'Services', value: infraData.docker.runningContainers, suffix: ' Run' },
    { label: 'Infra Health', value: infraData.infrastructureHealth, suffix: '%', isHealth: true },
  ];

  return (
    <div className="space-y-lg relative">
      <div className="flex justify-between items-center mb-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Infrastructure Dashboard</h1>
          <p className="font-body-sm text-secondary">Orchestrate and monitor EKS Kubernetes containers and digital twin engines.</p>
        </div>
        <div className="flex gap-md">
          <button 
            onClick={fetchData} 
            className="px-md py-sm bg-surface-container border border-outline-variant rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-lg">
        {metrics.map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl"
          >
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider block">{metric.label}</span>
            <span className={`font-display text-headline-lg mt-sm block ${metric.isHealth ? (metric.value > 90 ? 'text-emerald-600' : 'text-amber-600') : 'text-primary'}`}>
              <AnimatedNumber value={metric.value} />{metric.suffix}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Monitoring & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Monitoring Stack Status */}
        <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
          <div className="flex justify-between items-center mb-lg">
            <h3 className="font-headline-sm text-headline-sm">Monitoring Stack</h3>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Prometheus', status: 'healthy', detail: `${infraData.monitoring.prometheus.targetsUp}/${infraData.monitoring.prometheus.targetsTotal} Targets` },
              { name: 'Grafana', status: 'healthy', detail: `${infraData.monitoring.grafana.dashboards} Dashboards` },
              { name: 'ELK Stack', status: 'healthy', detail: infraData.logs.elasticsearch.clusterHealth.toUpperCase() },
              { name: 'Vault', status: 'healthy', detail: infraData.vault.sealedStatus },
            ].map((item, idx) => (
              <div key={idx} className="p-sm bg-surface-container rounded-lg border border-outline-variant flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined">monitoring</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md font-semibold">{item.name}</p>
                    <p className="text-[10px] text-secondary">{item.detail}</p>
                  </div>
                </div>
                <StatusBadge status={item.status} label="Healthy" />
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col">
          <div className="flex justify-between items-center mb-lg">
            <h3 className="font-headline-sm text-headline-sm">Active Alerts</h3>
          </div>
          <div className="space-y-4 flex-1 max-h-[300px] overflow-y-auto">
            {infraData.alerts.critical.map((alert) => (
              <div key={alert.id} className="p-sm bg-rose-50 border border-rose-200 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-label-md text-label-md font-semibold text-rose-800">{alert.message}</p>
                  <span className="bg-rose-200 text-rose-800 px-2 py-0.5 rounded text-xs font-bold">CRITICAL</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-rose-600">
                  <span>{alert.service}</span>
                  <span>•</span>
                  <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
            {infraData.alerts.warning.map((alert) => (
              <div key={alert.id} className="p-sm bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-label-md text-label-md font-semibold text-amber-800">{alert.message}</p>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${alert.status === 'firing' ? 'bg-amber-200 text-amber-800' : 'bg-emerald-200 text-emerald-800'}`}>
                    {alert.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-amber-600">
                  <span>{alert.service}</span>
                  <span>•</span>
                  <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col">
          <div className="flex justify-between items-center mb-lg">
            <h3 className="font-headline-sm text-headline-sm">Live Activity</h3>
          </div>
          <ActivityFeed />
        </div>
      </div>

      {/* Live Logs & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        {/* Live Logs */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col">
          <div className="p-lg border-b border-outline-variant flex justify-between items-center">
            <h3 className="font-headline-sm text-headline-sm">Live Logs</h3>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[300px] bg-background p-lg font-mono text-xs">
            {infraData.logs.liveLogs.map((log) => (
              <div key={log.id} className="mb-1">
                <span className="text-secondary">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span className={`ml-2 px-1 py-0.5 rounded ${
                  log.level === 'error' ? 'bg-rose-100 text-rose-800' : 
                  log.level === 'warn' ? 'bg-amber-100 text-amber-800' : 
                  'bg-primary-fixed text-on-primary-fixed-variant'
                }`}>{log.level.toUpperCase()}</span>
                <span className="ml-2 text-secondary">[{log.service}]</span>
                <span className="ml-2 text-on-surface">{log.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Events */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col">
          <div className="p-lg border-b border-outline-variant flex justify-between items-center">
            <h3 className="font-headline-sm text-headline-sm">System Events</h3>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[300px]">
            {infraData.systemEvents.map((event, idx) => (
              <div key={event.id} className="px-lg py-3 border-b border-outline-variant hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="font-label-md text-label-md font-semibold">{event.type.toUpperCase()}</span>
                  <span className="text-[10px] text-secondary">{new Date(event.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="pl-5 text-sm text-secondary">{event.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kubernetes Pods with DataTable */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
        <DataTable
          title="Kubernetes Pods"
          columns={podColumns}
          data={podData}
        />
      </div>
    </div>
  );
}
