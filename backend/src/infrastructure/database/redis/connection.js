import { createClient } from 'redis';
import { env } from '../../config/env.js';
import { logger } from '../../services/LoggerService.js';

let redisClient;
let useMock = false;

// Mock in-memory redis cache for development environments when Redis is offline
const memoryCache = new Map();
const mockRedisClient = {
  connect: async () => {
    logger.info('Using memory cache fallback (Redis offline)');
    return Promise.resolve();
  },
  get: async (key) => memoryCache.get(key) || null,
  set: async (key, val, options) => {
    memoryCache.set(key, val);
    return 'OK';
  },
  del: async (key) => {
    memoryCache.delete(key);
    return 1;
  },
  on: (event, handler) => {},
};

export const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: env.redisUrl
    });

    redisClient.on('error', (err) => {
      logger.warn(`Redis client error: ${err.message}. Switching to memory cache fallback.`);
      useMock = true;
      redisClient = mockRedisClient;
    });

    await redisClient.connect();
    logger.info('Connected to Redis successfully');
  } catch (error) {
    logger.warn(`Failed to connect to Redis server: ${error.message}. Defaulting to mock cache.`);
    useMock = true;
    redisClient = mockRedisClient;
  }
};

export const getCache = () => redisClient;
