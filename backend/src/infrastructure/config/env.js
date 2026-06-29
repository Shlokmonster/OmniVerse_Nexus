import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend folder
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const env = {
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/omniverse_nexus?schema=public',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  jwtSecret: process.env.JWT_SECRET || 'omniverse_nexus_jwt_secret_key_change_in_production_2026!',
  logLevel: process.env.LOG_LEVEL || 'info',
  vaultAddr: process.env.VAULT_ADDR || 'http://127.0.0.1:8200',
  vaultToken: process.env.VAULT_TOKEN || 'root'
};
