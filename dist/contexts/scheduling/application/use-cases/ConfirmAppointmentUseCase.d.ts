import { Appointment } from '../../domain/entities/Appointment.js';
import { ActorType } from '../../domain/entities/Appointment.js';
export interface ConfirmAppointmentInput {
    appointmentId: string;
    actorType: ActorType;
}
export interface ConfirmAppointmentOutput {
    id: string;
    status: {
        value: string;
    };
}
export interface AppointmentRepository {
    findById(id: string): Promise<Appointment | null>;
    save(appointment: Appointment): Promise<void>;
}
export declare class ConfirmAppointmentUseCase {
    private readonly appointmentRepo;
    constructor(appointmentRepo: AppointmentRepository);
    execute(input: ConfirmAppointmentInput): Promise<ConfirmAppointmentOutput>;
}
//# sourceMappingURL=ConfirmAppointmentUseCase.d.ts.map