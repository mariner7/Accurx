import { Appointment } from '../../contexts/scheduling/domain/entities/Appointment.js';
export declare class PostgresAppointmentRepository {
    save(appointment: Appointment): Promise<void>;
    findById(id: string): Promise<Appointment | null>;
    findByPatientId(patientId: string): Promise<Appointment[]>;
    findByDoctorId(doctorId: string): Promise<Appointment[]>;
    findByDoctorIdAndTimeRange(doctorId: string, startTime: Date, endTime: Date): Promise<Appointment[]>;
    findAll(): Promise<Appointment[]>;
    private mapToAppointment;
}
//# sourceMappingURL=PostgresAppointmentRepository.d.ts.map