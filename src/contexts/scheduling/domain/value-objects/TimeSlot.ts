import { DomainError } from '../../../../shared/errors/DomainError.js';

const APPOINTMENT_DURATION_MINUTES = 30;
const BUFFER_DURATION_MINUTES = 30;
const TOTAL_SLOT_MINUTES = APPOINTMENT_DURATION_MINUTES + BUFFER_DURATION_MINUTES;

export class TimeSlot {
  public readonly startTime: Date;
  public readonly endTime: Date;

  constructor(startTime: Date, fromPersistence = false) {
    if (!fromPersistence) {
      this.validateStartTime(startTime);
    }
    this.startTime = startTime;
    this.endTime = this.calculateEndTime(startTime);
  }

  private validateStartTime(startTime: Date): void {
    const now = new Date();
    if (startTime <= now) {
      throw new DomainError('Appointment cannot be scheduled in the past');
    }
  }

  public static get slotIntervalMinutes(): number {
    return TOTAL_SLOT_MINUTES;
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
