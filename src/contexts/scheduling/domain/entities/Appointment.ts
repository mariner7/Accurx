import { v4 as uuidv4 } from 'uuid';
import { TimeSlot } from '../value-objects/TimeSlot.js';
import { AppointmentStatus, AppointmentStatusEnum } from '../value-objects/AppointmentStatus.js';
import { ClinicalNotes, ClinicalNotesProps } from '../value-objects/ClinicalNotes.js';
import { PatientId } from '../../../patient/domain/entities/PatientId.js';
import { DoctorId } from '../../../doctor/domain/entities/DoctorId.js';
import { DomainError } from '../../../../shared/errors/DomainError.js';

export enum ActorType {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR'
}

export interface AppointmentProps {
  id?: string;
  patientId: PatientId;
  doctorId: DoctorId;
  timeSlot: TimeSlot;
  notes?: string;
  clinicalNotes?: ClinicalNotesProps;
  status?: AppointmentStatusEnum;
}

export class Appointment {
  public readonly id: string;
  public readonly patientId: PatientId;
  public readonly doctorId: DoctorId;
  public readonly createdAt: Date;

  private _timeSlot: TimeSlot;
  private _status: AppointmentStatus;
  private _notes: string | null;
  private _clinicalNotes: ClinicalNotes | null;
  private _updatedAt: Date;

  constructor(props: AppointmentProps) {
    this.id = props.id || uuidv4();
    this.patientId = props.patientId;
    this.doctorId = props.doctorId;
    this._timeSlot = props.timeSlot;
    this._status = props.status 
      ? new AppointmentStatus(props.status) 
      : new AppointmentStatus(AppointmentStatusEnum.RESERVED);
    this._notes = props.notes || null;
    this._clinicalNotes = props.clinicalNotes ? new ClinicalNotes(props.clinicalNotes) : null;
    this.createdAt = new Date();
    this._updatedAt = new Date();
  }

  get timeSlot(): TimeSlot {
    return this._timeSlot;
  }

  get status(): AppointmentStatus {
    return this._status;
  }

  get notes(): string | null {
    return this._notes;
  }

  get clinicalNotes(): ClinicalNotes | null {
    return this._clinicalNotes;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  addClinicalNotes(clinicalNotesProps: ClinicalNotesProps, actor: ActorType): void {
    if (actor !== ActorType.DOCTOR) {
      throw new DomainError('Solo un médico puede agregar notas clínicas');
    }

    if (this._clinicalNotes !== null) {
      throw new DomainError('Ya existen notas clínicas para esta cita');
    }

    this._clinicalNotes = new ClinicalNotes(clinicalNotesProps);
    this._markUpdated();
  }

  updateClinicalNotes(clinicalNotesProps: ClinicalNotesProps, actor: ActorType): void {
    if (actor !== ActorType.DOCTOR) {
      throw new DomainError('Solo un médico puede actualizar notas clínicas');
    }

    if (this._clinicalNotes === null) {
      throw new DomainError('No existen notas clínicas para actualizar');
    }

    this._clinicalNotes = new ClinicalNotes(clinicalNotesProps);
    this._markUpdated();
  }

  confirm(actor: ActorType): void {
    if (actor !== ActorType.DOCTOR) {
      throw new DomainError('Solo un médico puede confirmar una cita');
    }

    if (!this._status.canConfirm()) {
      throw new DomainError(`No se puede confirmar una cita con estado ${this._status.value}`);
    }

    this._status = new AppointmentStatus(AppointmentStatusEnum.CONFIRMED);
    this._markUpdated();
  }

  cancel(actor: ActorType): void {
    if (!this._status.canCancel()) {
      throw new DomainError(`No se puede cancelar una cita con estado ${this._status.value}`);
    }

    const hoursUntilAppointment = this.getHoursUntilAppointment();
    const allowedHours = actor === ActorType.PATIENT ? 24 : 1;

    if (hoursUntilAppointment < allowedHours) {
      throw new DomainError(
        `No se puede cancelar. ${actor === ActorType.PATIENT ? 'El paciente' : 'El médico'} debe cancelar al menos ${allowedHours}h antes`
      );
    }

    this._status = new AppointmentStatus(AppointmentStatusEnum.CANCELLED);
    this._markUpdated();
  }

  reschedule(newTimeSlot: TimeSlot): void {
    if (this._status.value === AppointmentStatusEnum.CANCELLED) {
      throw new DomainError('No se puede reprogramar una cita cancelada');
    }

    const hoursUntilAppointment = this.getHoursUntilAppointment();
    if (hoursUntilAppointment < 24) {
      throw new DomainError('No se puede reprogramar con menos de 24h de anticipación');
    }

    if (this._timeSlot.overlaps(newTimeSlot)) {
      throw new DomainError('El nuevo horario se traslapa con una cita existente');
    }

    this._timeSlot = newTimeSlot;
    this._markUpdated();
  }

  private getHoursUntilAppointment(): number {
    const now = new Date();
    const diffMs = this._timeSlot.startTime.getTime() - now.getTime();
    return diffMs / (1000 * 60 * 60);
  }

  private _markUpdated(): void {
    this._updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      patientId: this.patientId.value,
      doctorId: this.doctorId.value,
      startTime: this._timeSlot.startTime,
      endTime: this._timeSlot.endTime,
      status: { value: this._status.value },
      notes: this._notes,
      clinicalNotes: this._clinicalNotes ? this._clinicalNotes.toPlainObject() : null,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt
    };
  }
}
