import { DomainError } from '../../../../shared/errors/DomainError.js';

const APPOINTMENT_DURATION_MINUTES = 30;
const BUFFER_DURATION_MINUTES = 30;
const TOTAL_SLOT_MINUTES = APPOINTMENT_DURATION_MINUTES + BUFFER_DURATION_MINUTES;

export class TimeSlot {
  public readonly startTime: Date;
  public readonly endTime: Date;

  constructor(startTime: Date) {
    this.validateStartTime(startTime);
    this.startTime = startTime;
    this.endTime = this.calculateEndTime(startTime);
  }

  private validateStartTime(startTime: Date): void {
    const now = new Date();
    if (startTime <= now) {
      throw new DomainError('Appointment cannot be scheduled in the past');
    }

    const minutes = startTime.getMinutes();
    if (minutes % TOTAL_SLOT_MINUTES !== 0) {
      throw new DomainError(`Appointment must start at intervals of ${TOTAL_SLOT_MINUTES} minutes`);
    }
  }

  private calculateEndTime(startTime: Date): Date {
    const endTime = new Date(startTime.getTime() + APPOINTMENT_DURATION_MINUTES * 60 * 1000);
    return endTime;
  }

  get bufferEndTime(): Date {
    return new Date(this.startTime.getTime() + TOTAL_SLOT_MINUTES * 60 * 1000);
  }

  overlaps(other: TimeSlot): boolean {
    return this.startTime < other.bufferEndTime && this.bufferEndTime > other.startTime;
  }

  equals(other: TimeSlot): boolean {
    return this.startTime.getTime() === other.startTime.getTime();
  }
}
