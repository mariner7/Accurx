import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService, UserRole } from '../../../contexts/identity/domain/services/AuthService.js';
import { PostgresUserRepository } from '../../../contexts/identity/infrastructure/persistence/PostgresUserRepository.js';
import { PostgresPatientRepository } from '../../../infrastructure/repositories/PostgresPatientRepository.js';
import { Patient, Gender } from '../../../contexts/patient/domain/entities/Patient.js';

const authService = new AuthService();
const userRepository = new PostgresUserRepository();
const patientRepository = new PostgresPatientRepository();

const registerPatientSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  age: z.number().min(0).max(150),
  gender: z.enum(['MALE', 'FEMALE']),
  address: z.string().min(1),
  phone: z.string().min(1),
  allergies: z.string().optional()
});

const registerDoctorSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { role, ...data } = req.body;

      if (role === UserRole.PATIENT) {
        const validated = registerPatientSchema.parse(data);
        
        const existingUser = await userRepository.findByEmail(validated.email);
        if (existingUser) {
          res.status(409).json({
            error: { code: 'CONFLICT', message: 'Email already registered' }
          });
          return;
        }

        const patient = new Patient({
          name: validated.name,
          age: validated.age,
          gender: validated.gender as Gender,
          address: validated.address,
          phone: validated.phone,
          email: validated.email,
          allergies: validated.allergies
        });

        await patientRepository.save(patient);

        const passwordHash = await authService.hashPassword(validated.password);

        const user = {
          id: patient.id.value,
          email: validated.email,
          passwordHash,
          role: UserRole.PATIENT,
          patientId: patient.id.value
        };

        await userRepository.save(user);

        const token = authService.generateToken(user);
        const { passwordHash: _, ...userWithoutPassword } = user;

        res.status(201).json({ token, user: userWithoutPassword });
        return;
      }

      if (role === UserRole.DOCTOR) {
        const validated = registerDoctorSchema.parse(data);
        
        const existingUser = await userRepository.findByEmail(validated.email);
        if (existingUser) {
          res.status(409).json({
            error: { code: 'CONFLICT', message: 'Email already registered' }
          });
          return;
        }

        const { v4: uuidv4 } = await import('uuid');
        const passwordHash = await authService.hashPassword(validated.password);

        const user = {
          id: uuidv4(),
          email: validated.email,
          passwordHash,
          role: UserRole.DOCTOR
        };

        await userRepository.save(user);

        const token = authService.generateToken(user);
        const { passwordHash: _, ...userWithoutPassword } = user;

        res.status(201).json({ token, user: userWithoutPassword });
        return;
      }

      res.status(403).json({
        error: { code: 'FORBIDDEN', message: 'Invalid role' }
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          error: { code: 'BAD_REQUEST', message: 'Email and password are required' }
        });
        return;
      }

      const user = await userRepository.findByEmail(email);

      if (!user) {
        res.status(401).json({
          error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' }
        });
        return;
      }

      const isValid = await authService.verifyPassword(password, user.passwordHash);

      if (!isValid) {
        res.status(401).json({
          error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' }
        });
        return;
      }

      const { passwordHash: _, ...userWithoutPassword } = user;
      const token = authService.generateToken(userWithoutPassword);

      res.json({ token, user: userWithoutPassword });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
