import 'dotenv/config';
import { createApp } from './app.js';
import { testConnection, closeConnection } from './infrastructure/database/connection.js';
import { initializeDatabase } from './infrastructure/database/schema.js';
import { PostgresUserRepository } from './contexts/identity/infrastructure/persistence/PostgresUserRepository.js';
import { UserRole } from './contexts/identity/domain/services/AuthService.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const PORT = process.env.APP_PORT || 3000;

function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Required environment variable ${name} is not set`);
  }
  return value;
}

const ADMIN_EMAIL = getRequiredEnvVar('ADMIN_EMAIL');
const ADMIN_PASSWORD = getRequiredEnvVar('ADMIN_PASSWORD');

async function seedDefaultAdmin() {
  const userRepository = new PostgresUserRepository();
  const exists = await userRepository.existsByEmail(ADMIN_EMAIL);
  
  if (!exists) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, salt);

    const adminUser = {
      id: uuidv4(),
      email: ADMIN_EMAIL,
      passwordHash,
      role: UserRole.ADMIN
    };

    await userRepository.save(adminUser);
    console.log(`Default admin user created: ${ADMIN_EMAIL}`);
  }
}

async function start() {
  try {
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.warn('Warning: Database connection failed. Running without database.');
    } else {
      await initializeDatabase();
      console.log('Database initialized');
    }

    await seedDefaultAdmin();

    const app = createApp();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await closeConnection();
  process.exit(0);
});

start();
