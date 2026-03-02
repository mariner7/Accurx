// pg-migrate-config.ts

import 'dotenv/config';
import type { RunnerOption } from 'node-pg-migrate';

// Validate that all required environment variables are set
const requiredEnvVars = ['DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT', 'DB_NAME'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const config: Partial<RunnerOption> = {
  // Connection string
  databaseUrl: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,

  // Directory for migration files
  dir: 'migrations',

  // Name of the table to store migration history
  migrationsTable: 'pgmigrations',

  // Converts camelCase parameters to snake_case for table/column names
  decamelize: true,
};

// Use module.exports for better compatibility with node-pg-migrate's runner
module.exports = config;