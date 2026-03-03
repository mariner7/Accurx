import { Appointment } from '../../domain/entities/Appointment.js';
import { AppointmentPolicyService } from '../../domain/services/AppointmentPolicyService.js';
export interface RescheduleAppointmentInput {
    appointmentId: string;
    newStartTime: string;
}
export interface RescheduleAppointmentOutput {
    id: string;
    startTime: Date;
    endTime: Date;
}
export interface AppointmentRepository {
    findById(id: string): Promise<Appointment | null>;
    findByDoctorIdAndTimeRange(doctorId: string, startTime: Date, endTime: Date): Promise<Appointment[]>;
    save(appointment: Appointment): Promise<void>;
}
export declare class RescheduleAppointmentUseCase {
    private readonly appointmentRepo;
    private readonly policyService;
    constructor(appointmentRepo: AppointmentRepository, policyService: AppointmentPolicyService);
    execute(input: RescheduleAppointmentInput): Promise<RescheduleAppointmentOutput>;
}
//# sourceMappingURL=RescheduleAppointmentUseCase.d.ts.map