import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getSocket, connectSocket } from '../services/socketClient.js';
import { apiClient } from '../services/apiClient.js';
import { RealtimeMetricsChart } from '../components/Charts.jsx';
import ActivityFeed from '../components/ActivityFeed.jsx';
import WorldMap from '../components/WorldMap.jsx';
import DataTable from '../components/DataTable.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import AnimatedNumber from '../components/ui/AnimatedNumber.jsx';
import { useNotifications } from '../components/NotificationsProvider.jsx';

export default function Overview() {
  const [digitalTwinData, setDigitalTwinData] = useState(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const socket = connectSocket();

    const fetchInitialData = async () => {
      try {
        const response = await apiClient.get('/digitaltwin');
        if (response.data.success) {
          setDigitalTwinData(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch initial digital twin data:', err);
      }
    };
    
    fetchInitialData();

    if (socket) {
      socket.on('digitaltwin:init', (data) => setDigitalTwinData(data));
      socket.on('digitaltwin:update', (data) => setDigitalTwinData(data));
    }

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        addNotification({
          type: ['success', 'warning', 'info', 'error'][Math.floor(Math.random() * 4)],
          title: 'System Event',
          message: 'A new event has been detected in the infrastructure.'
        });
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      if (socket) {
        socket.off('digitaltwin:init');
        socket.off('digitaltwin:update');
      }
    };
  }, [addNotification]);

  if (!digitalTwinData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary">Loading Digital Twin Data...</p>
        </div>
      </div>
    );
  }

  const { countries, realtimeData } = digitalTwinData;

  const tableData = countries.flatMap(country => 
    country.cities.map(city => ({
      id: `${country.id}-${city.id}`,
      city: city.name,
      country: country.name,
      health: realtimeData[country.id].cities[city.id].health,
      traffic: realtimeData[country.id].cities[city.id].traffic.congestion,
      energy: realtimeData[country.id].cities[city.id].energy.consumption,
      aqi: realtimeData[country.id].cities[city.id].pollution.aqi,
    }))
  );

  const tableColumns = [
    { key: 'city', label: 'City', sortable: true },
    { key: 'country', label: 'Country', sortable: true },
    { 
      key: 'health', 
      label: 'Health', 
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            val > 90 ? 'bg-emerald-500' : val > 70 ? 'bg-amber-500' : 'bg-red-500'
          }`}></div>
          <span>{val.toFixed(1)}%</span>
        </div>
      )
    },
    { key: 'traffic', label: 'Traffic', sortable: true, render: (val) => `${val.toFixed(1)}%` },
    { key: 'energy', label: 'Energy', sortable: true, render: (val) => `${val.toFixed(1)} MW` },
    { key: 'aqi', label: 'AQI', sortable: true, render: (val) => val.toFixed(0) },
  ];

  const metrics = [
    { label: 'Total Cities', value: countries.reduce((sum, c) => sum + c.cities.length, 0), icon: 'location_city', color: 'text-indigo-600' },
    { label: 'Online Services', value: 142, icon: 'check_circle', color: 'text-emerald-600' },
    { label: 'Active Users', value: 8543, icon: 'people', color: 'text-blue-600' },
    { label: 'Alerts Today', value: 12, icon: 'notifications', color: 'text-amber-600' },
  ];

  return (
    <div className="space-y-lg">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
        {metrics.map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl"
          >
            <div className="flex justify-between items-start mb-md">
              <span className={`material-symbols-outlined ${metric.color}`}>{metric.icon}</span>
              <StatusBadge status="healthy" label="Active" />
            </div>
            <div className="font-display text-headline-lg text-primary">
              <AnimatedNumber value={metric.value} />
            </div>
            <p className="font-label-sm text-secondary">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Middle Section: World Map, Charts & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* World Map */}
        <div className="lg:col-span-8">
          <WorldMap />
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
          <div className="flex items-center justify-between mb-md">
            <h3 className="font-headline-sm text-headline-sm">Live Activity</h3>
            <span className="material-symbols-outlined text-secondary">schedule</span>
          </div>
          <ActivityFeed />
        </div>
      </div>

      {/* Real-time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
          <h3 className="font-headline-sm text-headline-sm mb-md">Real-time Metrics</h3>
          <RealtimeMetricsChart />
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
          <h3 className="font-headline-sm text-headline-sm mb-md">City Telemetry</h3>
          <div className="space-y-6">
            {countries.slice(0, 2).map((country, idx) => (
              <div key={idx} className="p-md rounded-lg bg-surface">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{country.name}</span>
                  <span className="text-sm text-secondary">{realtimeData[country.id].health.toFixed(1)}% Health</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-500" 
                    style={{ width: `${realtimeData[country.id].health}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Cities Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
        <DataTable
          title="Active Digital Twin Cities"
          columns={tableColumns}
          data={tableData}
        />
      </div>
    </div>
  );
}
