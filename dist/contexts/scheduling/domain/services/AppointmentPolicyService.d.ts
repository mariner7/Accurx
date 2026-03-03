import { TimeSlot } from '../value-objects/TimeSlot.js';
import { Appointment } from '../entities/Appointment.js';
export interface AppointmentRepository {
    findByDoctorIdAndTimeRange(doctorId: string, startTime: Date, endTime: Date): Promise<Appointment[]>;
    findById(id: string): Promise<Appointment | null>;
}
export declare class AppointmentPolicyService {
    private readonly repository;
    constructor(repository: AppointmentRepository);
    validateAvailability(doctorId: string, timeSlot: TimeSlot, excludeAppointmentId?: string): Promise<void>;
    private validateWorkingHours;
    private validateNoOverlap;
}
//# sourceMappingURL=AppointmentPolicyService.d.ts.map