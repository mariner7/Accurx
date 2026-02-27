import { Appointment, ActorType } from '../../domain/entities/Appointment.js';
import { DomainError } from '../../../../shared/errors/DomainError.js';

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

export class AddClinicalNotesUseCase {
  constructor(private readonly appointmentRepo: AppointmentRepository) {}

  async execute(input: AddClinicalNotesInput): Promise<AddClinicalNotesOutput> {
    const appointment = await this.appointmentRepo.findById(input.appointmentId);

    if (!appointment) {
      throw new DomainError('Cita no encontrada');
    }

    appointment.addClinicalNotes({
      observations: input.observations,
      diagnosis: input.diagnosis,
      treatment: input.treatment,
      followUp: input.followUp
    }, input.actorType);

    await this.appointmentRepo.save(appointment);

    const clinicalNotes = appointment.clinicalNotes;
    if (!clinicalNotes) {
      throw new DomainError('Error al agregar notas clínicas');
    }

    return {
      id: appointment.id,
      clinicalNotes: {
        observations: clinicalNotes.observations,
        diagnosis: clinicalNotes.diagnosis,
        treatment: clinicalNotes.treatment,
        followUp: clinicalNotes.followUp
      }
    };
  }
}
