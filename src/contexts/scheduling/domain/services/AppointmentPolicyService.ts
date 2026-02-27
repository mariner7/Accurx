import { TimeSlot } from '../value-objects/TimeSlot.js';
import { Appointment } from '../entities/Appointment.js';
import { DomainError } from '../../../../shared/errors/DomainError.js';

export interface AppointmentRepository {
  findByDoctorIdAndTimeRange(doctorId: string, startTime: Date, endTime: Date): Promise<Appointment[]>;
  findById(id: string): Promise<Appointment | null>;
}

const MIN_HOUR = 8;
const MAX_HOUR = 18;

export class AppointmentPolicyService {
  private readonly repository: AppointmentRepository;

  constructor(repository: AppointmentRepository) {
    this.repository = repository;
  }

  async validateAvailability(
    doctorId: string,
    timeSlot: TimeSlot,
    excludeAppointmentId?: string
  ): Promise<void> {
    await this.validateWorkingHours(timeSlot);
    await this.validateNoOverlap(doctorId, timeSlot, excludeAppointmentId);
  }

  private async validateWorkingHours(timeSlot: TimeSlot): Promise<void> {
    const startHour = timeSlot.startTime.getHours();
    const endHour = timeSlot.bufferEndTime.getHours();

    if (startHour < MIN_HOUR || endHour > MAX_HOUR) {
      throw new DomainError(`Las citas deben programarse entre las ${MIN_HOUR}:00 y las ${MAX_HOUR}:00`);
    }

    if (endHour > MAX_HOUR) {
      throw new DomainError('La cita se extiende más allá del horario laboral');
    }
  }

  private async validateNoOverlap(
    doctorId: string,
    timeSlot: TimeSlot,
    excludeAppointmentId?: string
  ): Promise<void> {
    const startRange = new Date(timeSlot.startTime.getTime() - 60 * 60 * 1000);
    const endRange = new Date(timeSlot.bufferEndTime.getTime() + 60 * 60 * 1000);

    const existingAppointments = await this.repository.findByDoctorIdAndTimeRange(
      doctorId,
      startRange,
      endRange
    );

    const conflicts = existingAppointments.filter(apt => {
      if (excludeAppointmentId && apt.id === excludeAppointmentId) {
        return false;
      }
      return timeSlot.overlaps(apt.timeSlot);
    });

    if (conflicts.length > 0) {
      throw new DomainError('El horario seleccionado conflictúa con una cita existente');
    }
  }
}
