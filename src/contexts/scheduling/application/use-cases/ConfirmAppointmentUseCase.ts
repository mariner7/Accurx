import { Appointment } from '../../domain/entities/Appointment.js';
import { ActorType } from '../../domain/entities/Appointment.js';
import { DomainError } from '../../../../shared/errors/DomainError.js';

export interface ConfirmAppointmentInput {
  appointmentId: string;
  actorType: ActorType;
}

export interface ConfirmAppointmentOutput {
  id: string;
  status: { value: string };
}

export interface AppointmentRepository {
  findById(id: string): Promise<Appointment | null>;
  save(appointment: Appointment): Promise<void>;
}

export class ConfirmAppointmentUseCase {
  constructor(private readonly appointmentRepo: AppointmentRepository) {}

  async execute(input: ConfirmAppointmentInput): Promise<ConfirmAppointmentOutput> {
    const appointment = await this.appointmentRepo.findById(input.appointmentId);

    if (!appointment) {
      throw new DomainError('Cita no encontrada');
    }

    appointment.confirm(input.actorType);

    await this.appointmentRepo.save(appointment);

    return {
      id: appointment.id,
      status: { value: appointment.status.value }
    };
  }
}
