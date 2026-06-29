import { logger } from './LoggerService.js';

export class InfrastructureService {
  constructor() {
    this.data = this.generateInitialData();
  }

  generateInitialData() {
    return {
      // Global status
      infrastructureHealth: 92.5,
      lastUpdated: new Date().toISOString(),
      
      // AWS Services
      aws: {
        ec2: {
          instances: [
            { id: 'i-0a1b2c3d4e5f6a7b8', name: 'eks-worker-01', status: 'running', type: 't3.xlarge', region: 'us-east-1', cpu: 66.81820979236426, memory: 67.66549930864964 },
            { id: 'i-1a1b2c3d4e5f6a7b9', name: 'eks-worker-02', status: 'running', type: 't3.xlarge', region: 'us-east-1', cpu: 61.002597844189786, memory: 70.37606946011424 },
            { id: 'i-2a1b2c3d4e5f6a7b0', name: 'eks-worker-03', status: 'running', type: 't3.large', region: 'us-west-2', cpu: 59.245215921101135, memory: 53.215976371010775 },
            { id: 'i-3a1b2c3d4e5f6a7b1', name: 'eks-control-plane', status: 'running', type: 'm5.large', region: 'us-east-1', cpu: 32.511231387562205, memory: 39.90144881425807 }
          ],
          totalInstances: 12,
          activeInstances: 12
        },
        rds: {
          instances: [
            { id: 'db-xyz123', name: 'omniversedb', status: 'available', engine: 'PostgreSQL', version: '15.3', cpu: 44.74443485571813, memory: 76.73961770667415, storageUsed: '82.4 GB', storageTotal: '200 GB' },
            { id: 'db-abc789', name: 'analyticsdb', status: 'available', engine: 'PostgreSQL', version: '14.7', cpu: 38.50377487050875, memory: 59.82086997845434, storageUsed: '156.2 GB', storageTotal: '500 GB' }
          ]
        },
        s3: {
          buckets: [
            { name: 'omniverse-assets', size: '1.2 TB', objects: 15623, lastModified: new Date().toISOString() },
            { name: 'omniverse-logs', size: '45.6 GB', objects: 892341, lastModified: new Date().toISOString() },
            { name: 'omniverse-backups', size: '3.8 TB', objects: 124, lastModified: new Date(Date.now() - 86400000).toISOString() }
          ]
        },
        vpc: {
          id: 'vpc-0abc123def456ghi7',
          cidr: '10.0.0.0/16',
          subnets: 6,
          securityGroups: [
            { id: 'sg-0123456789abcdef0', name: 'eks-cluster-sg', rules: 24, status: 'active' },
            { id: 'sg-1234567890abcdef1', name: 'public-access-sg', rules: 8, status: 'active' },
            { id: 'sg-2345678901abcdef2', name: 'internal-db-sg', rules: 12, status: 'active' }
          ]
        },
        loadBalancer: {
          dns: 'omniverse-alb-123456789.us-east-1.elb.amazonaws.com',
          status: 'active',
          activeConnections: 12456,
          requestRate: 452.3
        },
        autoScaling: {
          groups: [
            { name: 'eks-workers-asg', minSize: 3, maxSize: 20, desiredCapacity: 12, currentInstances: 12, status: 'active' }
          ]
        }
      },
      
      // Kubernetes
      kubernetes: {
        nodes: [
          { name: 'ip-10-0-1-100.ec2.internal', status: 'Ready', cpu: 68.35268160002069, memory: 67.1218710620143, pods: 12, age: '45d' },
          { name: 'ip-10-0-1-101.ec2.internal', status: 'Ready', cpu: 71.25211545450922, memory: 72.26895752519209, pods: 11, age: '45d' },
          { name: 'ip-10-0-2-100.ec2.internal', status: 'Ready', cpu: 57.998744108543676, memory: 62.92853709017624, pods: 8, age: '30d' }
        ],
        pods: [
          { name: 'simulation-engine-789456123-abc12', namespace: 'default', status: 'Running', cpu: '1.3 Core', memory: '2.5 GB', age: '4d 12h', containers: 1 },
          { name: 'simulation-engine-789456123-def34', namespace: 'default', status: 'Running', cpu: '1.0 Core', memory: '2.3 GB', age: '4d 12h', containers: 1 },
          { name: 'websocket-gateway-123456789-ghi56', namespace: 'default', status: 'Running', cpu: '0.6 Core', memory: '0.5 GB', age: '2d 6h', containers: 1 },
          { name: 'database-proxy-456789123-jkl78', namespace: 'default', status: 'Running', cpu: '0.9 Core', memory: '1.8 GB', age: '10d', containers: 1 }
        ],
        deployments: [
          { name: 'simulation-engine', replicas: 2, readyReplicas: 2, updatedReplicas: 2, availableReplicas: 2, age: '30d' },
          { name: 'websocket-gateway', replicas: 1, readyReplicas: 1, updatedReplicas: 1, availableReplicas: 1, age: '45d' },
          { name: 'database-proxy', replicas: 1, readyReplicas: 1, updatedReplicas: 1, availableReplicas: 1, age: '60d' }
        ]
      },
      
      // Docker
      docker: {
        containers: [
          { id: 'abc123def456', name: 'omniverse-backend', status: 'Up 4 days', image: 'omniverse/backend:v4.2.0', cpu: 77.25139158506758, memory: '74.2%' },
          { id: 'def456ghi789', name: 'omniverse-frontend', status: 'Up 4 days', image: 'omniverse/frontend:v4.2.0', cpu: 26.91807358108195, memory: '31.5%' },
          { id: 'ghi789jkl012', name: 'omniverse-redis', status: 'Up 10 days', image: 'redis:7-alpine', cpu: 14.445579552049786, memory: '12.3%' },
          { id: 'jkl012mno345', name: 'omniverse-postgres', status: 'Up 10 days', image: 'postgres:15', cpu: 43.923544259280646, memory: '78.9%' }
        ],
        totalContainers: 18,
        runningContainers: 18
      },
      
      // Databases
      databases: {
        redis: {
          status: 'healthy',
          connectedClients: 124,
          usedMemory: '456 MB',
          hitRate: 98.7,
          opsPerSecond: 1245.3
        },
        postgresql: {
          status: 'healthy',
          activeConnections: 89,
          cacheHitRate: 95.2,
          transactionsPerSecond: 156.7,
          replicationLag: '0s'
        }
      },
      
      // Node.js Backend
      nodejs: {
        status: 'healthy',
        uptime: '4d 12h',
        cpu: 72.01543325505811,
        memory: '74.2%',
        eventLoopDelay: '2.4ms',
        activeRequests: 162,
        version: 'v22.2.0'
      },
      
      // CI/CD
      jenkins: {
        pipelines: [
          { id: 1, name: 'omniverse-backend', status: 'success', lastRun: new Date(Date.now() - 1800000).toISOString(), duration: '4m 23s' },
          { id: 2, name: 'omniverse-frontend', status: 'success', lastRun: new Date(Date.now() - 3600000).toISOString(), duration: '2m 15s' },
          { id: 3, name: 'terraform-apply', status: 'running', lastRun: new Date(Date.now() - 600000).toISOString(), duration: '10m 0s (running)' },
          { id: 4, name: 'omniverse-e2e-tests', status: 'failed', lastRun: new Date(Date.now() - 86400000).toISOString(), duration: '15m 45s' }
        ]
      },
      
      // Terraform
      terraform: {
        state: 'applied',
        lastApply: new Date(Date.now() - 3600000).toISOString(),
        resourcesCreated: 456,
        resourcesUpdated: 12,
        resourcesDestroyed: 0
      },
      
      // System metrics
      metrics: {
        cpu: 72.30045125061399,
        memory: 76.5695677766035,
        disk: { used: '823 GB', total: '2 TB', usage: 41.2 },
        network: {
          inbound: '1.2 GB/s',
          outbound: '892 MB/s',
          activeConnections: 12456
        },
        latency: 15 + Math.random() * 10
      },

      // Prometheus/Grafana Monitoring
      monitoring: {
        prometheus: {
          status: 'healthy',
          targetsUp: 23,
          targetsTotal: 25,
          scrapeDuration: '2.1s'
        },
        grafana: {
          dashboards: 42,
          alertsFiring: 2,
          lastDashboardRefresh: new Date(Date.now() - 30000).toISOString()
        }
      },

      // ELK Stack Logging
      logs: {
        elasticsearch: {
          status: 'green',
          clusterHealth: 'green',
          indices: 156,
          documents: 123456789
        },
        logstash: {
          pipelines: 8,
          eventsPerSecond: 4567.8
        },
        kibana: {
          savedSearches: 89,
          visualizations: 134
        },
        liveLogs: [
          { id: 'log-1', timestamp: new Date(Date.now() - 5000).toISOString(), level: 'info', message: 'User logged in successfully', service: 'auth-service', traceId: 'trace-123' },
          { id: 'log-2', timestamp: new Date(Date.now() - 10000).toISOString(), level: 'info', message: 'Simulation started for Tokyo', service: 'simulation-engine', traceId: 'trace-456' },
          { id: 'log-3', timestamp: new Date(Date.now() - 15000).toISOString(), level: 'warn', message: 'High CPU usage detected', service: 'backend-api', traceId: 'trace-789' },
          { id: 'log-4', timestamp: new Date(Date.now() - 20000).toISOString(), level: 'error', message: 'Connection to external service failed', service: 'backend-api', traceId: 'trace-abc' }
        ],
        errorLogs: [
          { id: 'err-1', timestamp: new Date(Date.now() - 20000).toISOString(), error: 'Connection timeout', stackTrace: 'Error: Connection timeout at ...', service: 'backend-api', user: 'user-1' },
          { id: 'err-2', timestamp: new Date(Date.now() - 3600000).toISOString(), error: 'Invalid credentials', stackTrace: 'Error: Invalid credentials at ...', service: 'auth-service', user: 'user-2' }
        ],
        requestLogs: [
          { id: 'req-1', timestamp: new Date(Date.now() - 1000).toISOString(), method: 'GET', path: '/api/users', statusCode: 200, duration: '45', ip: '192.168.1.10' },
          { id: 'req-2', timestamp: new Date(Date.now() - 2000).toISOString(), method: 'POST', path: '/api/simulations', statusCode: 201, duration: '120', ip: '192.168.1.11' },
          { id: 'req-3', timestamp: new Date(Date.now() - 3000).toISOString(), method: 'GET', path: '/api/health', statusCode: 200, duration: '10', ip: '192.168.1.12' }
        ]
      },

      // Alerts
      alerts: {
        critical: [
          { id: 'alert-1', timestamp: new Date(Date.now() - 60000).toISOString(), severity: 'critical', message: 'Disk space low on worker 01', service: 'aws-ec2', status: 'firing' },
          { id: 'alert-2', timestamp: new Date(Date.now() - 300000).toISOString(), severity: 'critical', message: 'High error rate in auth service', service: 'backend-api', status: 'firing' }
        ],
        warning: [
          { id: 'alert-3', timestamp: new Date(Date.now() - 600000).toISOString(), severity: 'warning', message: 'CPU usage >80%', service: 'aws-ec2', status: 'firing' },
          { id: 'alert-4', timestamp: new Date(Date.now() - 900000).toISOString(), severity: 'warning', message: 'Memory usage high', service: 'redis', status: 'resolved' }
        ],
        history: [
          { id: 'alert-5', timestamp: new Date(Date.now() - 3600000).toISOString(), severity: 'warning', message: 'High latency spike detected', service: 'backend-api', status: 'resolved' },
          { id: 'alert-6', timestamp: new Date(Date.now() - 7200000).toISOString(), severity: 'info', message: 'Deployment successful', service: 'jenkins', status: 'resolved' }
        ]
      },
      
      // System Events
      systemEvents: [
        { id: 'event-1', timestamp: new Date(Date.now() - 1800000).toISOString(), type: 'deployment', message: 'Simulation engine updated to v4.2.1' },
        { id: 'event-2', timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'autoscaling', message: 'Scaled up to 12 instances' },
        { id: 'event-3', timestamp: new Date(Date.now() - 7200000).toISOString(), type: 'security', message: 'API key rotated' }
      ],

      // Vault Security
      vault: {
        status: 'healthy',
        sealed: false,
        sealedStatus: 'unlocked',
        secrets: {
          totalSecrets: 45,
          activeSecrets: 42,
          expiringSecrets: 3,
          lastRotation: new Date(Date.now() - 3600000).toISOString()
        },
        certificates: [
          { id: 'cert-1', name: 'omniverse-tls', type: 'server', expires: new Date(Date.now() + 30*24*60*60*1000).toISOString(), status: 'valid' },
          { id: 'cert-2', name: 'database-tls', type: 'server', expires: new Date(Date.now() + 60*24*60*60*1000).toISOString(), status: 'valid' },
          { id: 'cert-3', name: 'client-cert', type: 'client', expires: new Date(Date.now() + 7*24*60*60*1000).toISOString(), status: 'expiring' }
        ],
        apiKeys: [
          { id: 'key-1', name: 'frontend-api', role: 'viewer', created: new Date(Date.now() - 30*24*60*60*1000).toISOString(), lastUsed: new Date(Date.now() - 3600000).toISOString(), status: 'active' },
          { id: 'key-2', name: 'analytics-api', role: 'operator', created: new Date(Date.now() - 60*24*60*60*1000).toISOString(), lastUsed: new Date(Date.now() - 86400000).toISOString(), status: 'active' }
        ],
        rbac: {
          roles: ['admin', 'operator', 'viewer'],
          policies: 12,
          securityHealth: 94.5
        }
      }
    };
  }

  updateData() {
    // Update metrics with random values (simulate real changes)
    this.data.metrics.cpu = Math.max(20, Math.min(95, this.data.metrics.cpu + (Math.random() * 4 - 2)));
    this.data.metrics.memory = Math.max(20, Math.min(95, this.data.metrics.memory + (Math.random() * 3 - 1.5)));
    this.data.metrics.latency = Math.max(10, Math.min(100, this.data.metrics.latency + (Math.random() * 4 - 2)));
    this.data.infrastructureHealth = Math.max(70, Math.min(99, this.data.infrastructureHealth + (Math.random() * 2 - 1)));
    
    // Update EC2 instances
    this.data.aws.ec2.instances.forEach(instance => {
      instance.cpu = Math.max(10, Math.min(95, instance.cpu + (Math.random() * 4 - 2)));
      instance.memory = Math.max(20, Math.min(95, instance.memory + (Math.random() * 3 - 1.5)));
    });
    
    // Update Kubernetes nodes
    this.data.kubernetes.nodes.forEach(node => {
      node.cpu = Math.max(10, Math.min(95, node.cpu + (Math.random() * 4 - 2)));
      node.memory = Math.max(20, Math.min(95, node.memory + (Math.random() * 3 - 1.5)));
    });
    
    // Update Kubernetes pods
    this.data.kubernetes.pods.forEach(pod => {
      const cpuVal = Math.max(0.1, Math.min(2.5, parseFloat(pod.cpu) + (Math.random() * 0.2 - 0.1)));
      const memVal = Math.max(0.5, Math.min(4, parseFloat(pod.memory) + (Math.random() * 0.2 - 0.1)));
      pod.cpu = `${cpuVal.toFixed(1)} Core`;
      pod.memory = `${memVal.toFixed(1)} GB`;
    });
    
    // Update RDS instances
    this.data.aws.rds.instances.forEach(db => {
      db.cpu = Math.max(10, Math.min(90, db.cpu + (Math.random() * 4 - 2)));
      db.memory = Math.max(30, Math.min(95, db.memory + (Math.random() * 3 - 1.5)));
    });
    
    // Update Docker containers
    this.data.docker.containers.forEach(container => {
      container.cpu = Math.max(10, Math.min(90, container.cpu + (Math.random() * 4 - 2)));
    });
    
    // Update Node.js metrics
    this.data.nodejs.cpu = Math.max(20, Math.min(95, this.data.nodejs.cpu + (Math.random() * 4 - 2)));
    this.data.nodejs.activeRequests = Math.max(50, Math.min(200, Math.floor(this.data.nodejs.activeRequests + (Math.random() * 20 - 10))));
    
    // Add new logs
    if (Math.random() < 0.3) {
      this.data.logs.liveLogs.unshift({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        level: ['info', 'info', 'warn', 'error'][Math.floor(Math.random() * 4)],
        message: ['User action completed', 'Service health check passed', 'Resource accessed', 'Configuration updated'][Math.floor(Math.random() * 4)],
        service: ['backend', 'auth', 'simulation', 'database'][Math.floor(Math.random() * 4)],
        traceId: `trace-${Math.random().toString(36).substr(2, 9)}`
      });
      if (this.data.logs.liveLogs.length > 100) {
        this.data.logs.liveLogs.length = 100;
      }
    }
    
    // Update last updated time
    this.data.lastUpdated = new Date().toISOString();
    
    logger.debug('Infrastructure data updated');
    return this.data;
  }

  getData() {
    return this.data;
  }
}

// Singleton instance
export const infrastructureService = new InfrastructureService();
