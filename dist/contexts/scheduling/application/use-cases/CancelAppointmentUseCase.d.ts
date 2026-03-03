import { Appointment } from '../../domain/entities/Appointment.js';
import { ActorType } from '../../domain/entities/Appointment.js';
export interface CancelAppointmentInput {
    appointmentId: string;
    actorType: ActorType;
}
export interface CancelAppointmentOutput {
    id: string;
    status: {
        value: string;
    };
}
export interface AppointmentRepository {
    findById(id: string): Promise<Appointment | null>;
    save(appointment: Appointment): Promise<void>;
}
export declare class CancelAppointmentUseCase {
    private readonly appointmentRepo;
    constructor(appointmentRepo: AppointmentRepository);
    execute(input: CancelAppointmentInput): Promise<CancelAppointmentOutput>;
}
//# sourceMappingURL=CancelAppointmentUseCase.d.ts.map