import { DomainError } from '../../../../shared/errors/DomainError.js';
export class AddClinicalNotesUseCase {
    appointmentRepo;
    constructor(appointmentRepo) {
        this.appointmentRepo = appointmentRepo;
    }
    async execute(input) {
        const appointment = await this.appointmentRepo.findById(input.appointmentId);
        if (!appointment) {
            throw new DomainError('Cita no encontrada');
        }
        appointment.addClinicalNotes({
            observations: input.observations,
            diagnosis: input.diagnosis,
            treatment: input.treatment,
            followUp: input.followUp
        }, input.actorType);
        await this.appointmentRepo.save(appointment);
        const clinicalNotes = appointment.clinicalNotes;
        if (!clinicalNotes) {
            throw new DomainError('Error al agregar notas clínicas');
        }
        return {
            id: appointment.id,
            clinicalNotes: {
                observations: clinicalNotes.observations,
                diagnosis: clinicalNotes.diagnosis,
                treatment: clinicalNotes.treatment,
                followUp: clinicalNotes.followUp
            }
        };
    }
}
//# sourceMappingURL=AddClinicalNotesUseCase.js.map