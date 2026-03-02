import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Patient, Gender } from '../../../contexts/patient/domain/entities/Patient.js';
import { PostgresPatientRepository } from '../../../infrastructure/repositories/PostgresPatientRepository.js';

const createPatientSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().min(0).max(150),
  gender: z.enum(['MALE', 'FEMALE']),
  address: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  allergies: z.string().optional()
});

const patientIdSchema = z.object({
  id: z.string().uuid()
});

const patientRepo = new PostgresPatientRepository();

export class PatientController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = createPatientSchema.parse(req.body);
      
      const patient = new Patient({
        name: validated.name,
        age: validated.age,
        gender: validated.gender as Gender,
        address: validated.address,
        phone: validated.phone,
        email: validated.email,
        allergies: validated.allergies
      });

      await patientRepo.save(patient);

      res.status(201).json(patient);
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const patients = await patientRepo.findAll();
      res.json(patients.map(p => p.toJSON()));
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = patientIdSchema.parse(req.params);
      const patient = await patientRepo.findById(id);

      if (!patient) {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Patient not found' } });
        return;
      }

      res.json(patient.toJSON());
    } catch (error) {
      next(error);
    }
  }
}

export const patientController = new PatientController();
