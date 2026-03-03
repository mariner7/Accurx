import { DomainError } from '../../../../shared/errors/DomainError.js';
const MIN_HOUR = 8;
const MAX_HOUR = 18;
export class AppointmentPolicyService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async validateAvailability(doctorId, timeSlot, excludeAppointmentId) {
        await this.validateWorkingHours(timeSlot);
        await this.validateNoOverlap(doctorId, timeSlot, excludeAppointmentId);
    }
    async validateWorkingHours(timeSlot) {
        const startHour = timeSlot.startTime.getHours();
        const endHour = timeSlot.bufferEndTime.getHours();
        if (startHour < MIN_HOUR || endHour > MAX_HOUR) {
            throw new DomainError(`Las citas deben programarse entre las ${MIN_HOUR}:00 y las ${MAX_HOUR}:00`);
        }
        if (endHour > MAX_HOUR) {
            throw new DomainError('La cita se extiende más allá del horario laboral');
        }
    }
    async validateNoOverlap(doctorId, timeSlot, excludeAppointmentId) {
        const startRange = new Date(timeSlot.startTime.getTime() - 60 * 60 * 1000);
        const endRange = new Date(timeSlot.bufferEndTime.getTime() + 60 * 60 * 1000);
        const existingAppointments = await this.repository.findByDoctorIdAndTimeRange(doctorId, startRange, endRange);
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
//# sourceMappingURL=AppointmentPolicyService.js.map