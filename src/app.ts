import express, { Express } from 'express';
import cors from 'cors';
import { errorHandler } from './infrastructure/http/middlewares/errorHandler.js';
import { apiRoutes } from './infrastructure/http/routes/index.js';
import { setupSwagger } from './swagger.js';

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/', apiRoutes);

  setupSwagger(app);

  app.use(errorHandler);

  return app;
}
