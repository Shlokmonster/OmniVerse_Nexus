// Restart trigger 2 - Omniverse backend
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { env } from '../config/env.js';
import { logger } from '../services/LoggerService.js';
import { httpRequestDurationMicroseconds, register } from '../services/MetricsService.js';
import { connectPostgres, prisma } from '../database/prisma/connection.js';
import { connectRedis, getCache } from '../database/redis/connection.js';
import { initWebSocket } from '../socket/websocket.js';
import { authController } from '../../interface-adapters/controllers/AuthController.js';
import { projectController } from '../../interface-adapters/controllers/ProjectController.js';
import { userController } from '../../interface-adapters/controllers/UserController.js';
import { digitalTwinController } from '../../interface-adapters/controllers/DigitalTwinController.js';
import { infrastructureController } from '../../interface-adapters/controllers/InfrastructureController.js';
import { chaosController } from '../../interface-adapters/controllers/ChaosController.js';
import { requireAuth, requirePermission } from './middleware/auth.js';
import { errorHandler } from './middleware/error.js';
import { validateAuth, validateTelemetry } from './middleware/validate.js';

// Swagger imports
import swaggerUi from 'swagger-ui-express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Initialize database connections - gracefully handle failures for dev
const initDatabases = async () => {
  try {
    await connectPostgres();
  } catch (err) {
    logger.warn(`PostgreSQL not available yet: ${err.message} - continuing in dev mode`);
  }
  try {
    await connectRedis();
  } catch (err) {
    logger.warn(`Redis not available yet: ${err.message} - continuing in dev mode`);
  }
};

// Security and utility middlewares
app.use(helmet({
  contentSecurityPolicy: false // disabled for swagger ui resource loads
}));
app.use(cors());
app.use(express.json());

// Prometheus Metrics Middleware
app.use((req, res, next) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationInSeconds = diff[0] + diff[1] / 1e9;
    
    // Resolve route pattern (e.g. /api/projects/123 -> /api/projects/:id)
    let route = req.baseUrl + req.path;
    if (req.params) {
      Object.keys(req.params).forEach(key => {
        route = route.replace(req.params[key], `:${key}`);
      });
    }

    httpRequestDurationMicroseconds
      .labels(req.method, route || req.path, res.statusCode)
      .observe(durationInSeconds);
  });
  next();
});

// Logging HTTP Requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Load Swagger document
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './swagger.json'), 'utf8')
);

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Metrics Endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

// Health Check Endpoint
app.get('/health', async (req, res) => {
  const healthInfo = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: 'UNKNOWN',
      redis: 'UNKNOWN'
    }
  };

  try {
    // Check DB if prisma is connected
    if (prisma) {
      await prisma.$queryRaw`SELECT 1`;
      healthInfo.checks.database = 'UP';
    }
  } catch (error) {
    healthInfo.checks.database = 'DOWN';
    logger.warn(`Health check database: ${error.message}`);
  }

  try {
    // Check Redis
    const cacheClient = getCache();
    if (cacheClient && typeof cacheClient.get === 'function') {
      await cacheClient.set('health_check', 'ok', { EX: 5 });
      const val = await cacheClient.get('health_check');
      if (val === 'ok') {
        healthInfo.checks.redis = 'UP';
      }
    }
  } catch (error) {
    healthInfo.checks.redis = 'DOWN';
    logger.warn(`Health check redis: ${error.message}`);
  }

  return res.status(200).json(healthInfo);
});

// API Routes
app.post('/api/auth/register', validateAuth, authController.register);
app.post('/api/auth/login', validateAuth, authController.login);

app.get('/api/projects', requireAuth, projectController.getProjects);
app.post('/api/projects', requireAuth, requirePermission('write:simulation'), projectController.createProject);
app.get('/api/projects/:id', requireAuth, projectController.getProjectDetails);
app.post('/api/projects/:id/telemetry', requireAuth, requirePermission('write:simulation'), validateTelemetry, projectController.addTelemetry);

app.get('/api/scaling-events', requireAuth, projectController.getScalingEvents);
app.post('/api/scaling-events', requireAuth, requirePermission('execute:scaling'), projectController.logScalingEvent);

// User Profile Routes
app.get('/api/users', requireAuth, requirePermission('read:all'), userController.getUsers);
app.get('/api/users/me', requireAuth, userController.getMe);
app.patch('/api/users/me', requireAuth, userController.updateMe);

// Digital Twin Routes - no auth required for demo
app.get('/api/digitaltwin', digitalTwinController.getGlobalData);
app.get('/api/digitaltwin/:countryId', digitalTwinController.getCountryData);
app.get('/api/digitaltwin/:countryId/:cityId', digitalTwinController.getCityData);

// Infrastructure Routes - no auth required for demo
app.get('/api/infrastructure', infrastructureController.getInfrastructureData);
app.get('/api/infrastructure/aws', infrastructureController.getAwsData);
app.get('/api/infrastructure/kubernetes', infrastructureController.getKubernetesData);
app.get('/api/infrastructure/databases', infrastructureController.getDatabaseData);

// Chaos Simulation Routes - no auth required for demo
app.get('/api/chaos/scenarios', chaosController.getAllScenarios);
app.post('/api/chaos/start', chaosController.startSimulation);
app.post('/api/chaos/stop', chaosController.stopSimulation);
app.get('/api/chaos/active', chaosController.getActiveSimulation);
app.get('/api/chaos/history', chaosController.getSimulationHistory);

// Fallback error handlers
app.use(errorHandler);

// WebSocket init
initWebSocket(server);

// Boot server
const PORT = env.port;
initDatabases().then(() => {
  server.listen(PORT, () => {
    logger.info(`OmniVerse Nexus Server running on port ${PORT}`);
    logger.info(`API Docs available at http://localhost:${PORT}/api-docs`);
    logger.info(`Prometheus Metrics available at http://localhost:${PORT}/metrics`);
  });
}).catch(err => {
  logger.error(`Failed to initialize server: ${err.message}`);
});

// Handle graceful shutdowns
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully.');
  server.close(() => {
    prisma.$disconnect();
    logger.info('Process terminated.');
  });
});
