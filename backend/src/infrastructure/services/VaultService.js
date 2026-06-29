import { env } from '../config/env.js';
import { logger } from './LoggerService.js';

export class VaultService {
  constructor() {
    this.vaultAddr = env.vaultAddr;
    this.vaultToken = env.vaultToken;
  }

  /**
   * Fetch a secret from Vault. Falls back to environment variables.
   * @param {string} path secret path (e.g. secret/data/database)
   * @param {string} key key inside secret data
   * @returns {Promise<string>} secret value
   */
  async getSecret(path, key) {
    try {
      const response = await fetch(`${this.vaultAddr}/v1/${path}`, {
        headers: {
          'X-Vault-Token': this.vaultToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Vault returned status: ${response.status}`);
      }

      const data = await response.json();
      // Vault KV v2 structure has data.data.data[key]
      if (data && data.data && data.data.data) {
        return data.data.data[key];
      }
      // Vault KV v1 structure has data.data[key]
      if (data && data.data) {
        return data.data[key];
      }
      throw new Error('Unexpected Vault data format');
    } catch (error) {
      logger.warn(`Failed to fetch secret from Vault (${path}:${key}). Error: ${error.message}. Falling back to env variables.`);
      
      // Fallback logic
      const envKey = key.toUpperCase();
      return process.env[envKey] || '';
    }
  }
}

export const vaultService = new VaultService();
