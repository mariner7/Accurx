import { DomainError } from '../../../../shared/errors/DomainError.js';
export class ConfirmAppointmentUseCase {
    appointmentRepo;
    constructor(appointmentRepo) {
        this.appointmentRepo = appointmentRepo;
    }
    async execute(input) {
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
//# sourceMappingURL=ConfirmAppointmentUseCase.js.map