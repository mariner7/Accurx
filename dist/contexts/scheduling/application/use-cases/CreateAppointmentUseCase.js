import { Appointment } from '../../domain/entities/Appointment.js';
import { TimeSlot } from '../../domain/value-objects/TimeSlot.js';
import { PatientId } from '../../../patient/domain/entities/PatientId.js';
import { DoctorId } from '../../../doctor/domain/entities/DoctorId.js';
import { DomainError } from '../../../../shared/errors/DomainError.js';
export class CreateAppointmentUseCase {
    appointmentRepo;
    patientRepo;
    doctorRepo;
    policyService;
    constructor(appointmentRepo, patientRepo, doctorRepo, policyService) {
        this.appointmentRepo = appointmentRepo;
        this.patientRepo = patientRepo;
        this.doctorRepo = doctorRepo;
        this.policyService = policyService;
    }
    async execute(input) {
        const patient = await this.patientRepo.findById(input.patientId);
        if (!patient) {
            throw new DomainError('Paciente no encontrado');
        }
        const doctor = await this.doctorRepo.findById(input.doctorId);
        if (!doctor) {
            throw new DomainError('Médico no encontrado');
        }
        const timeSlot = new TimeSlot(new Date(input.startTime));
        await this.policyService.validateAvailability(input.doctorId, timeSlot);
        const appointment = new Appointment({
            patientId: new PatientId(input.patientId),
            doctorId: new DoctorId(input.doctorId),
            timeSlot,
            notes: input.notes
        });
        await this.appointmentRepo.save(appointment);
        return {
            id: appointment.id,
            patientId: appointment.patientId.value,
            doctorId: appointment.doctorId.value,
            startTime: appointment.timeSlot.startTime,
            endTime: appointment.timeSlot.endTime,
            status: { value: appointment.status.value },
            notes: appointment.notes,
            createdAt: appointment.createdAt
        };
    }
}
//# sourceMappingURL=CreateAppointmentUseCase.js.map