import { DomainError } from '../../shared/errors/DomainError.js';
const MIN_DURATION_MINUTES = 15;
const MAX_DURATION_HOURS = 4;
export class TimeSlot {
    startTime;
    endTime;
    constructor(startTime, endTime) {
        this.validate(startTime, endTime);
        this.startTime = startTime;
        this.endTime = endTime;
    }
    validate(startTime, endTime) {
        if (startTime >= endTime) {
            throw new DomainError('Start time must be before end time');
        }
        const durationMs = endTime.getTime() - startTime.getTime();
        const durationMinutes = durationMs / (1000 * 60);
        if (durationMinutes < MIN_DURATION_MINUTES) {
            throw new DomainError(`Minimum duration is ${MIN_DURATION_MINUTES} minutes`);
        }
        const durationHours = durationMinutes / 60;
        if (durationHours > MAX_DURATION_HOURS) {
            throw new DomainError(`Maximum duration is ${MAX_DURATION_HOURS} hours`);
        }
    }
    overlaps(other) {
        return this.startTime < other.endTime && this.endTime > other.startTime;
    }
    equals(other) {
        return (this.startTime.getTime() === other.startTime.getTime() &&
            this.endTime.getTime() === other.endTime.getTime());
    }
}
//# sourceMappingURL=TimeSlot.js.map