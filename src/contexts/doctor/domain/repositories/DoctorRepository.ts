import { Doctor } from '../../domain/entities/Doctor.js';

export interface DoctorRepository {
  save(doctor: Doctor): Promise<void>;
  findById(id: string): Promise<Doctor | null>;
  findAll(): Promise<Doctor[]>;
}
