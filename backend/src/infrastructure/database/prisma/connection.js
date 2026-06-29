import { PrismaClient } from '@prisma/client';
import { logger } from '../../services/LoggerService.js';

export const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'info' },
    { emit: 'stdout', level: 'warn' },
    { emit: 'stdout', level: 'error' },
  ],
});

prisma.$on('query', (e) => {
  logger.debug(`Query: ${e.query} | Duration: ${e.duration}ms`);
});

export const connectPostgres = async () => {
  try {
    await prisma.$connect();
    logger.info('Successfully connected to PostgreSQL via Prisma');
  } catch (error) {
    logger.warn(`PostgreSQL Connection Error: ${error.message} - DB not available in dev mode`);
  }
};
