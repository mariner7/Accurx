import express, { Express } from 'express';
import cors from 'cors';
import { errorHandler } from './interfaces/http/middlewares/errorHandler.js';
import { authenticate, requireDoctor, requireRole, requireAdmin } from './interfaces/http/middlewares/auth.js';
import { UserRole } from './contexts/identity/domain/services/AuthService.js';
import { appointmentController } from './interfaces/http/controllers/AppointmentController.js';
import { patientController } from './interfaces/http/controllers/PatientController.js';
import { doctorController } from './interfaces/http/controllers/DoctorController.js';
import { authController } from './interfaces/http/controllers/AuthController.js';
import { setupSwagger } from './swagger.js';

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.post('/auth/register', authController.register.bind(authController));
  app.post('/auth/login', authController.login.bind(authController));

  app.post('/appointments', authenticate, appointmentController.create.bind(appointmentController));
  app.get('/appointments', authenticate, appointmentController.getAll.bind(appointmentController));
  app.get('/appointments/:id', authenticate, appointmentController.getById.bind(appointmentController));
  app.put('/appointments/:id', authenticate, appointmentController.update.bind(appointmentController));
  app.post('/appointments/:id/confirm', authenticate, requireDoctor, appointmentController.confirm.bind(appointmentController));
  app.post('/appointments/:id/cancel', authenticate, appointmentController.cancel.bind(appointmentController));
  app.post('/appointments/:id/clinical-notes', authenticate, requireDoctor, appointmentController.addClinicalNotes.bind(appointmentController));

  app.post('/patients', authenticate, requireDoctor, patientController.create.bind(patientController));
  app.get('/patients', authenticate, requireDoctor, patientController.getAll.bind(patientController));
  app.get('/patients/:id', authenticate, patientController.getById.bind(patientController));

  app.post('/doctors', authenticate, requireAdmin, doctorController.create.bind(doctorController));
  app.get('/doctors', doctorController.getAll.bind(doctorController));
  app.get('/doctors/:id', authenticate, requireRole(UserRole.ADMIN, UserRole.DOCTOR), doctorController.getById.bind(doctorController));

  setupSwagger(app);

  app.use(errorHandler);

  return app;
}
