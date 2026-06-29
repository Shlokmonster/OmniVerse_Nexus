import client from 'prom-client';

// Enable default metrics collection (CPU, Memory, etc.)
client.collectDefaultMetrics({ register: client.register });

// Create custom metrics
export const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in microseconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

export const activeWebsocketConnections = new client.Gauge({
  name: 'active_websocket_connections',
  help: 'Number of currently active websocket connections'
});

export const simulationNodeStatus = new client.Gauge({
  name: 'simulation_node_status',
  help: 'Status score of simulation nodes',
  labelNames: ['region', 'node_id']
});

export const register = client.register;
export { client };
