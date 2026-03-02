import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Doctor } from '../../../contexts/doctor/domain/entities/Doctor.js';
import { PostgresDoctorRepository } from '../../../infrastructure/repositories/PostgresDoctorRepository.js';
import { PostgresUserRepository } from '../../../contexts/identity/infrastructure/persistence/PostgresUserRepository.js';
import { AuthService, UserRole } from '../../../contexts/identity/domain/services/AuthService.js';

const createDoctorSchema = z.object({
  name: z.string().min(1),
  specialty: z.string().min(1),
  licenseNumber: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6)
});

const doctorIdSchema = z.object({
  id: z.string().uuid()
});

const doctorRepo = new PostgresDoctorRepository();
const userRepo = new PostgresUserRepository();
const authService = new AuthService();

export class DoctorController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = createDoctorSchema.parse(req.body);
      
      const doctor = new Doctor({
        name: validated.name,
        specialty: validated.specialty,
        licenseNumber: validated.licenseNumber,
        phone: validated.phone,
        email: validated.email
      });

      await doctorRepo.save(doctor);

      const passwordHash = await authService.hashPassword(validated.password);
      const user = {
        id: doctor.id.value,
        email: validated.email,
        passwordHash,
        role: UserRole.DOCTOR,
        doctorId: doctor.id.value
      };

      await userRepo.save(user);

      res.status(201).json({
        id: doctor.id.value,
        name: doctor.name,
        specialty: doctor.specialty,
        licenseNumber: doctor.licenseNumber,
        phone: doctor.phone,
        email: doctor.email
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const doctors = await doctorRepo.findAll();
      res.json(doctors.map(d => d.toJSON()));
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = doctorIdSchema.parse(req.params);
      const doctor = await doctorRepo.findById(id);

      if (!doctor) {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Doctor not found' } });
        return;
      }

      res.json(doctor.toJSON());
    } catch (error) {
      next(error);
    }
  }
}

export const doctorController = new DoctorController();
