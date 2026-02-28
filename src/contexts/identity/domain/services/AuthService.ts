import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { DomainError } from '../../../../shared/errors/DomainError.js';

export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  patientId?: string;
  doctorId?: string;
}

export interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
  patientId?: string;
  doctorId?: string;
}

export interface AuthResult {
  token: string;
  user: Omit<User, 'passwordHash'>;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(user: Omit<User, 'passwordHash'>): string {
    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      patientId: user.patientId,
      doctorId: user.doctorId
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' as const });
  }

  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch {
      throw new DomainError('Invalid or expired token');
    }
  }
}
