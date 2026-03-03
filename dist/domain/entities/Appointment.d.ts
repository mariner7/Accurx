import { TimeSlot } from '../value-objects/TimeSlot.js';
import { AppointmentStatus } from '../value-objects/AppointmentStatus.js';
export interface CreateAppointmentProps {
    id?: string;
    patientId: string;
    doctorId: string;
    timeSlot: TimeSlot;
    notes?: string;
}
export interface AppointmentData {
    id: string;
    patientId: string;
    doctorId: string;
    timeSlot: TimeSlot;
    status: AppointmentStatus;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Appointment {
    readonly id: string;
    readonly patientId: string;
    readonly doctorId: string;
    readonly notes: string | null;
    readonly createdAt: Date;
    private _updatedAt;
    private _timeSlot;
    private _status;
    constructor(props: CreateAppointmentProps);
    private validateProps;
    get timeSlot(): TimeSlot;
    get status(): AppointmentStatus;
    get updatedAt(): Date;
    confirm(): void;
    cancel(): void;
    reschedule(newTimeSlot: TimeSlot): void;
    complete(): void;
    markNoShow(): void;
    isActive(): boolean;
    private _markUpdated;
    toData(): AppointmentData;
}
//# sourceMappingURL=Appointment.d.ts.map