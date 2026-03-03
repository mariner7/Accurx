import { TimeSlot } from '../../domain/value-objects/TimeSlot.js';
import { DomainError } from '../../../../shared/errors/DomainError.js';
export class RescheduleAppointmentUseCase {
    appointmentRepo;
    policyService;
    constructor(appointmentRepo, policyService) {
        this.appointmentRepo = appointmentRepo;
        this.policyService = policyService;
    }
    async execute(input) {
        const appointment = await this.appointmentRepo.findById(input.appointmentId);
        if (!appointment) {
            throw new DomainError('Cita no encontrada');
        }
        const newTimeSlot = new TimeSlot(new Date(input.newStartTime));
        await this.policyService.validateAvailability(appointment.doctorId.value, newTimeSlot, appointment.id);
        appointment.reschedule(newTimeSlot);
        await this.appointmentRepo.save(appointment);
        return {
            id: appointment.id,
            startTime: appointment.timeSlot.startTime,
            endTime: appointment.timeSlot.endTime
        };
    }
}
//# sourceMappingURL=RescheduleAppointmentUseCase.js.map