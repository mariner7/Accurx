import { Appointment } from '../../domain/entities/Appointment.js';
import { TimeSlot } from '../../domain/value-objects/TimeSlot.js';
import { AppointmentPolicyService } from '../../domain/services/AppointmentPolicyService.js';
import { DomainError } from '../../../../shared/errors/DomainError.js';

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

export class RescheduleAppointmentUseCase {
  constructor(
    private readonly appointmentRepo: AppointmentRepository,
    private readonly policyService: AppointmentPolicyService
  ) {}

  async execute(input: RescheduleAppointmentInput): Promise<RescheduleAppointmentOutput> {
    const appointment = await this.appointmentRepo.findById(input.appointmentId);

    if (!appointment) {
      throw new DomainError('Cita no encontrada');
    }

    const newTimeSlot = new TimeSlot(new Date(input.newStartTime));

    await this.policyService.validateAvailability(
      appointment.doctorId.value,
      newTimeSlot,
      appointment.id
    );

    appointment.reschedule(newTimeSlot);

    await this.appointmentRepo.save(appointment);

    return {
      id: appointment.id,
      startTime: appointment.timeSlot.startTime,
      endTime: appointment.timeSlot.endTime
    };
  }
}
