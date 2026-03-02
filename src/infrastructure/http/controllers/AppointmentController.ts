import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { CreateAppointmentUseCase } from '../../../contexts/scheduling/application/use-cases/CreateAppointmentUseCase.js';
import { ConfirmAppointmentUseCase } from '../../../contexts/scheduling/application/use-cases/ConfirmAppointmentUseCase.js';
import { CancelAppointmentUseCase } from '../../../contexts/scheduling/application/use-cases/CancelAppointmentUseCase.js';
import { RescheduleAppointmentUseCase } from '../../../contexts/scheduling/application/use-cases/RescheduleAppointmentUseCase.js';
import { AddClinicalNotesUseCase } from '../../../contexts/scheduling/application/use-cases/AddClinicalNotesUseCase.js';
import { PostgresAppointmentRepository } from '../../../infrastructure/repositories/PostgresAppointmentRepository.js';
import { PostgresPatientRepository } from '../../../infrastructure/repositories/PostgresPatientRepository.js';
import { PostgresDoctorRepository } from '../../../infrastructure/repositories/PostgresDoctorRepository.js';
import { AppointmentPolicyService } from '../../../contexts/scheduling/domain/services/AppointmentPolicyService.js';
import { ActorType } from '../../../contexts/scheduling/domain/entities/Appointment.js';

const createAppointmentSchema = z.object({
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  startTime: z.string().datetime(),
  notes: z.string().optional()
});

const updateAppointmentSchema = z.object({
  startTime: z.string().datetime()
});

const clinicalNotesSchema = z.object({
  observations: z.string().min(1),
  diagnosis: z.string().nullable(),
  treatment: z.string().nullable(),
  followUp: z.string().nullable()
});

const appointmentIdSchema = z.object({
  id: z.string().uuid()
});

const appointmentRepo = new PostgresAppointmentRepository();
const patientRepo = new PostgresPatientRepository();
const doctorRepo = new PostgresDoctorRepository();
const policyService = new AppointmentPolicyService(appointmentRepo);

const createAppointmentUseCase = new CreateAppointmentUseCase(
  appointmentRepo,
  patientRepo,
  doctorRepo,
  policyService
);

const confirmAppointmentUseCase = new ConfirmAppointmentUseCase(appointmentRepo);
const cancelAppointmentUseCase = new CancelAppointmentUseCase(appointmentRepo);
const rescheduleAppointmentUseCase = new RescheduleAppointmentUseCase(
  appointmentRepo,
  policyService
);
const addClinicalNotesUseCase = new AddClinicalNotesUseCase(appointmentRepo);

export class AppointmentController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = createAppointmentSchema.parse(req.body);
      
      const result = await createAppointmentUseCase.execute(validated);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const appointments = await appointmentRepo.findAll();
      res.json(appointments.map(a => a.toJSON()));
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = appointmentIdSchema.parse(req.params);
      const appointment = await appointmentRepo.findById(id);

      if (!appointment) {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Appointment not found' } });
        return;
      }

      res.json(appointment.toJSON());
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = appointmentIdSchema.parse(req.params);
      const { startTime } = updateAppointmentSchema.parse(req.body);

      const result = await rescheduleAppointmentUseCase.execute({
        appointmentId: id,
        newStartTime: startTime
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async confirm(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = appointmentIdSchema.parse(req.params);
      const actorType = (req.body.actorType as ActorType) || ActorType.DOCTOR;

      console.log('Confirming appointment:', id, 'actor:', actorType);

      const result = await confirmAppointmentUseCase.execute({
        appointmentId: id,
        actorType
      });

      console.log('Confirm result:', result);

      res.json(result);
    } catch (error) {
      console.error('Confirm error:', error);
      next(error);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = appointmentIdSchema.parse(req.params);
      const actorType = (req.body.actorType as ActorType) || ActorType.PATIENT;

      console.log('Cancelling appointment:', id, 'actor:', actorType);

      const result = await cancelAppointmentUseCase.execute({
        appointmentId: id,
        actorType
      });

      console.log('Cancel result:', result);

      res.json(result);
    } catch (error) {
      console.error('Cancel error:', error);
      next(error);
    }
  }

  async addClinicalNotes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = appointmentIdSchema.parse(req.params);
      const validated = clinicalNotesSchema.parse(req.body);
      const actorType = ActorType.DOCTOR;

      const result = await addClinicalNotesUseCase.execute({
        appointmentId: id,
        actorType,
        observations: validated.observations,
        diagnosis: validated.diagnosis,
        treatment: validated.treatment,
        followUp: validated.followUp
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const appointmentController = new AppointmentController();
