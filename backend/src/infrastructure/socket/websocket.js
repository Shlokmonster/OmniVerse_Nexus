import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { logger } from '../services/LoggerService.js';
import { activeWebsocketConnections } from '../services/MetricsService.js';
import { prisma } from '../database/prisma/connection.js';
import { globalDataStore, updateSimulationData } from '../services/DigitalTwinSimulationService.js';
import { infrastructureService } from '../services/InfrastructureService.js';

export let io;

export const initWebSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // Adjust for production
      methods: ['GET', 'POST'],
    },
  });
  global.io = io; // Make io globally available

  // Authentication Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    
    // For demo, allow unauthenticated connections for now, or use mock if needed
    if (!token) {
      // Mock user for demo
      socket.user = {
        id: 'demo-user',
        email: 'demo@example.com',
        role: 'Admin',
        permissions: ['*']
      };
      return next();
    }

    try {
      const decoded = jwt.verify(token, env.jwtSecret);
      socket.user = decoded;
      next();
    } catch (err) {
      // If invalid token, still allow as demo user
      socket.user = {
        id: 'demo-user',
        email: 'demo@example.com',
        role: 'Admin',
        permissions: ['*']
      };
      next();
    }
  });

  io.on('connection', (socket) => {
    activeWebsocketConnections.inc();
    logger.info(`Websocket client connected: ${socket.user.email} (Socket ID: ${socket.id})`);
    
    // Send initial data to new client
    socket.emit('digitaltwin:init', globalDataStore);
    socket.emit('infrastructure:init', infrastructureService.getData());

    // Subscribe to specific digital twin rooms
    socket.on('subscribe:project', (projectId) => {
      socket.join(projectId);
      logger.info(`Socket ${socket.id} subscribed to project: ${projectId}`);
    });

    socket.on('unsubscribe:project', (projectId) => {
      socket.leave(projectId);
      logger.info(`Socket ${socket.id} unsubscribed from project: ${projectId}`);
    });

    socket.on('disconnect', () => {
      activeWebsocketConnections.dec();
      logger.info(`Websocket client disconnected: ${socket.id}`);
    });
  });

  // Start background simulation stream
  startSimulationBroadcast();
};

const startSimulationBroadcast = () => {
  // Broadcast updates every 5 seconds
  setInterval(async () => {
    try {
      if (!io) return;
      
      // Update simulation data
      const digitalTwinData = updateSimulationData();
      const infrastructureData = infrastructureService.updateData();

      io.emit('digitaltwin:update', digitalTwinData);
      io.emit('infrastructure:update', infrastructureData);
      logger.info('Updates broadcasted');
    } catch (err) {
      logger.error(`Error in startSimulationBroadcast loop: ${err.message}`);
    }
  }, 5000);
};
