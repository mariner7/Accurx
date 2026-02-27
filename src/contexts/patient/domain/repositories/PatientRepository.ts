import { Patient } from '../../domain/entities/Patient.js';

export interface PatientRepository {
  save(patient: Patient): Promise<void>;
  findById(id: string): Promise<Patient | null>;
  findAll(): Promise<Patient[]>;
}
