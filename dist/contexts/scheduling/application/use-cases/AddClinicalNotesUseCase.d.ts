import { Appointment, ActorType } from '../../domain/entities/Appointment.js';
export interface AddClinicalNotesInput {
    appointmentId: string;
    actorType: ActorType;
    observations: string;
    diagnosis: string | null;
    treatment: string | null;
    followUp: string | null;
}
export interface ClinicalNotesOutput {
    observations: string;
    diagnosis: string | null;
    treatment: string | null;
    followUp: string | null;
}
export interface AddClinicalNotesOutput {
    id: string;
    clinicalNotes: ClinicalNotesOutput;
}
export interface AppointmentRepository {
    findById(id: string): Promise<Appointment | null>;
    save(appointment: Appointment): Promise<void>;
}
export declare class AddClinicalNotesUseCase {
    private readonly appointmentRepo;
    constructor(appointmentRepo: AppointmentRepository);
    execute(input: AddClinicalNotesInput): Promise<AddClinicalNotesOutput>;
}
//# sourceMappingURL=AddClinicalNotesUseCase.d.ts.map