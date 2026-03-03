import { Doctor } from '../../contexts/doctor/domain/entities/Doctor.js';
export declare class PostgresDoctorRepository {
    save(doctor: Doctor): Promise<void>;
    findById(id: string): Promise<Doctor | null>;
    findAll(): Promise<Doctor[]>;
    private mapToDoctor;
}
//# sourceMappingURL=PostgresDoctorRepository.d.ts.map