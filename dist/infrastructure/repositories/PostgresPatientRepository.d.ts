import { Patient } from '../../contexts/patient/domain/entities/Patient.js';
export declare class PostgresPatientRepository {
    save(patient: Patient): Promise<void>;
    findById(id: string): Promise<Patient | null>;
    findAll(): Promise<Patient[]>;
    private mapToPatient;
}
//# sourceMappingURL=PostgresPatientRepository.d.ts.map