import { v4 as uuidv4 } from 'uuid';
import { AppointmentStatus, AppointmentStatusEnum } from '../value-objects/AppointmentStatus.js';
import { ClinicalNotes } from '../value-objects/ClinicalNotes.js';
import { DomainError } from '../../../../shared/errors/DomainError.js';
export var ActorType;
(function (ActorType) {
    ActorType["PATIENT"] = "PATIENT";
    ActorType["DOCTOR"] = "DOCTOR";
})(ActorType || (ActorType = {}));
export class Appointment {
    id;
    patientId;
    doctorId;
    createdAt;
    _timeSlot;
    _status;
    _notes;
    _clinicalNotes;
    _updatedAt;
    constructor(props) {
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
    get timeSlot() {
        return this._timeSlot;
    }
    get status() {
        return this._status;
    }
    get notes() {
        return this._notes;
    }
    get clinicalNotes() {
        return this._clinicalNotes;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    addClinicalNotes(clinicalNotesProps, actor) {
        if (actor !== ActorType.DOCTOR) {
            throw new DomainError('Solo un médico puede agregar notas clínicas');
        }
        if (this._clinicalNotes !== null) {
            throw new DomainError('Ya existen notas clínicas para esta cita');
        }
        this._clinicalNotes = new ClinicalNotes(clinicalNotesProps);
        this._markUpdated();
    }
    updateClinicalNotes(clinicalNotesProps, actor) {
        if (actor !== ActorType.DOCTOR) {
            throw new DomainError('Solo un médico puede actualizar notas clínicas');
        }
        if (this._clinicalNotes === null) {
            throw new DomainError('No existen notas clínicas para actualizar');
        }
        this._clinicalNotes = new ClinicalNotes(clinicalNotesProps);
        this._markUpdated();
    }
    confirm(actor) {
        if (actor !== ActorType.DOCTOR) {
            throw new DomainError('Solo un médico puede confirmar una cita');
        }
        if (!this._status.canConfirm()) {
            throw new DomainError(`No se puede confirmar una cita con estado ${this._status.value}`);
        }
        this._status = new AppointmentStatus(AppointmentStatusEnum.CONFIRMED);
        this._markUpdated();
    }
    cancel(actor) {
        if (!this._status.canCancel()) {
            throw new DomainError(`No se puede cancelar una cita con estado ${this._status.value}`);
        }
        const hoursUntilAppointment = this.getHoursUntilAppointment();
        const allowedHours = actor === ActorType.PATIENT ? 24 : 1;
        if (hoursUntilAppointment < allowedHours) {
            throw new DomainError(`No se puede cancelar. ${actor === ActorType.PATIENT ? 'El paciente' : 'El médico'} debe cancelar al menos ${allowedHours}h antes`);
        }
        this._status = new AppointmentStatus(AppointmentStatusEnum.CANCELLED);
        this._markUpdated();
    }
    reschedule(newTimeSlot) {
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
    getHoursUntilAppointment() {
        const now = new Date();
        const diffMs = this._timeSlot.startTime.getTime() - now.getTime();
        return diffMs / (1000 * 60 * 60);
    }
    _markUpdated() {
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
//# sourceMappingURL=Appointment.js.map