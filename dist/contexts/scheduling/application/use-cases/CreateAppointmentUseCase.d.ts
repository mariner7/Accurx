import { Appointment } from '../../domain/entities/Appointment.js';
import { AppointmentPolicyService } from '../../domain/services/AppointmentPolicyService.js';
export interface CreateAppointmentInput {
    patientId: string;
    doctorId: string;
    startTime: string;
    notes?: string;
}
export interface CreateAppointmentOutput {
    id: string;
    patientId: string;
    doctorId: string;
    startTime: Date;
    endTime: Date;
    status: {
        value: string;
    };
    notes: string | null;
    createdAt: Date;
}
export interface AppointmentRepository {
    save(appointment: Appointment): Promise<void>;
    findByDoctorIdAndTimeRange(doctorId: string, startTime: Date, endTime: Date): Promise<Appointment[]>;
}
export interface PatientRepository {
    findById(id: string): Promise<any>;
}
export interface DoctorRepository {
    findById(id: string): Promise<any>;
}
export declare class CreateAppointmentUseCase {
    private readonly appointmentRepo;
    private readonly patientRepo;
    private readonly doctorRepo;
    private readonly policyService;
    constructor(appointmentRepo: AppointmentRepository, patientRepo: PatientRepository, doctorRepo: DoctorRepository, policyService: AppointmentPolicyService);
    execute(input: CreateAppointmentInput): Promise<CreateAppointmentOutput>;
}
//# sourceMappingURL=CreateAppointmentUseCase.d.ts.map