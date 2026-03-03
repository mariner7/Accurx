import { AppointmentStatus, AppointmentStatusEnum } from '../value-objects/AppointmentStatus.js';
import { DomainError } from '../../shared/errors/DomainError.js';
import { v4 as uuidv4 } from 'uuid';
export class Appointment {
    id;
    patientId;
    doctorId;
    notes;
    createdAt;
    _updatedAt;
    _timeSlot;
    _status;
    constructor(props) {
        this.validateProps(props);
        this.id = props.id || uuidv4();
        this.patientId = props.patientId;
        this.doctorId = props.doctorId;
        this._timeSlot = props.timeSlot;
        this._status = new AppointmentStatus(AppointmentStatusEnum.SCHEDULED);
        this.notes = props.notes || null;
        this.createdAt = new Date();
        this._updatedAt = new Date();
    }
    validateProps(props) {
        if (!props.patientId || props.patientId.trim() === '') {
            throw new DomainError('Patient ID is required');
        }
        if (!props.doctorId || props.doctorId.trim() === '') {
            throw new DomainError('Doctor ID is required');
        }
        const now = new Date();
        if (props.timeSlot.startTime < now) {
            throw new DomainError('Appointment cannot be scheduled in the past');
        }
    }
    get timeSlot() {
        return this._timeSlot;
    }
    get status() {
        return this._status;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    confirm() {
        if (!this._status.canTransitionTo(AppointmentStatusEnum.CONFIRMED)) {
            throw new DomainError(`Cannot confirm appointment with status ${this._status.value}`);
        }
        this._status = new AppointmentStatus(AppointmentStatusEnum.CONFIRMED);
        this._markUpdated();
    }
    cancel() {
        if (!this._status.canTransitionTo(AppointmentStatusEnum.CANCELLED)) {
            throw new DomainError(`Cannot cancel appointment with status ${this._status.value}`);
        }
        this._status = new AppointmentStatus(AppointmentStatusEnum.CANCELLED);
        this._markUpdated();
    }
    reschedule(newTimeSlot) {
        if (this._status.isTerminal()) {
            throw new DomainError('Cannot reschedule a terminal appointment');
        }
        if (this._timeSlot.overlaps(newTimeSlot)) {
            throw new DomainError('New time slot overlaps with current time slot');
        }
        this._timeSlot = newTimeSlot;
        this._status = new AppointmentStatus(AppointmentStatusEnum.SCHEDULED);
        this._markUpdated();
    }
    complete() {
        if (!this._status.canTransitionTo(AppointmentStatusEnum.COMPLETED)) {
            throw new DomainError(`Cannot complete appointment with status ${this._status.value}`);
        }
        this._status = new AppointmentStatus(AppointmentStatusEnum.COMPLETED);
        this._markUpdated();
    }
    markNoShow() {
        if (!this._status.canTransitionTo(AppointmentStatusEnum.NO_SHOW)) {
            throw new DomainError(`Cannot mark as no-show with status ${this._status.value}`);
        }
        this._status = new AppointmentStatus(AppointmentStatusEnum.NO_SHOW);
        this._markUpdated();
    }
    isActive() {
        return this._status.isActive();
    }
    _markUpdated() {
        this._updatedAt = new Date();
    }
    toData() {
        return {
            id: this.id,
            patientId: this.patientId,
            doctorId: this.doctorId,
            timeSlot: this._timeSlot,
            status: this._status,
            notes: this.notes,
            createdAt: this.createdAt,
            updatedAt: this._updatedAt
        };
    }
}
//# sourceMappingURL=Appointment.js.map