import { Appointment } from '../../domain/entities/Appointment.js';
import { TimeSlot } from '../../domain/value-objects/TimeSlot.js';
import { PatientId } from '../../../patient/domain/entities/PatientId.js';
import { DoctorId } from '../../../doctor/domain/entities/DoctorId.js';
import { AppointmentPolicyService } from '../../domain/services/AppointmentPolicyService.js';
import { DomainError } from '../../../../shared/errors/DomainError.js';

export interface CreateAppointmentInput {
  patientId: string;
  doctorId: string;
  startTime: string;
  notes?: string;
}

export interface CreateAppointmentOutput {
  id: string;
  patientId: string;
  doctorId: string;
  startTime: Date;
  endTime: Date;
  status: { value: string };
  notes: string | null;
  createdAt: Date;
}

export interface AppointmentRepository {
  save(appointment: Appointment): Promise<void>;
  findByDoctorIdAndTimeRange(doctorId: string, startTime: Date, endTime: Date): Promise<Appointment[]>;
}

export interface PatientRepository {
  findById(id: string): Promise<any>;
}

export interface DoctorRepository {
  findById(id: string): Promise<any>;
}

export class CreateAppointmentUseCase {
  constructor(
    private readonly appointmentRepo: AppointmentRepository,
    private readonly patientRepo: PatientRepository,
    private readonly doctorRepo: DoctorRepository,
    private readonly policyService: AppointmentPolicyService
  ) {}

  async execute(input: CreateAppointmentInput): Promise<CreateAppointmentOutput> {
    const patient = await this.patientRepo.findById(input.patientId);
    if (!patient) {
      throw new DomainError('Paciente no encontrado');
    }

    const doctor = await this.doctorRepo.findById(input.doctorId);
    if (!doctor) {
      throw new DomainError('Médico no encontrado');
    }

    const timeSlot = new TimeSlot(new Date(input.startTime));

    await this.policyService.validateAvailability(
      input.doctorId,
      timeSlot
    );

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
