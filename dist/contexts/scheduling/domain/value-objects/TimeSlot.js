import { DomainError } from '../../../../shared/errors/DomainError.js';
const APPOINTMENT_DURATION_MINUTES = 30;
const BUFFER_DURATION_MINUTES = 30;
const TOTAL_SLOT_MINUTES = APPOINTMENT_DURATION_MINUTES + BUFFER_DURATION_MINUTES;
export class TimeSlot {
    startTime;
    endTime;
    constructor(startTime, fromPersistence = false) {
        if (!fromPersistence) {
            this.validateStartTime(startTime);
        }
        this.startTime = startTime;
        this.endTime = this.calculateEndTime(startTime);
    }
    validateStartTime(startTime) {
        const now = new Date();
        if (startTime <= now) {
            throw new DomainError('Appointment cannot be scheduled in the past');
        }
    }
    static get slotIntervalMinutes() {
        return TOTAL_SLOT_MINUTES;
    }
    calculateEndTime(startTime) {
        const endTime = new Date(startTime.getTime() + APPOINTMENT_DURATION_MINUTES * 60 * 1000);
        return endTime;
    }
    get bufferEndTime() {
        return new Date(this.startTime.getTime() + TOTAL_SLOT_MINUTES * 60 * 1000);
    }
    overlaps(other) {
        return this.startTime < other.bufferEndTime && this.bufferEndTime > other.startTime;
    }
    equals(other) {
        return this.startTime.getTime() === other.startTime.getTime();
    }
}
//# sourceMappingURL=TimeSlot.js.map