import { TimeSlot } from '../value-objects/TimeSlot.js';
import { AppointmentStatus, AppointmentStatusEnum } from '../value-objects/AppointmentStatus.js';
import { ClinicalNotes, ClinicalNotesProps } from '../value-objects/ClinicalNotes.js';
import { PatientId } from '../../../patient/domain/entities/PatientId.js';
import { DoctorId } from '../../../doctor/domain/entities/DoctorId.js';
export declare enum ActorType {
    PATIENT = "PATIENT",
    DOCTOR = "DOCTOR"
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
export declare class Appointment {
    readonly id: string;
    readonly patientId: PatientId;
    readonly doctorId: DoctorId;
    readonly createdAt: Date;
    private _timeSlot;
    private _status;
    private _notes;
    private _clinicalNotes;
    private _updatedAt;
    constructor(props: AppointmentProps);
    get timeSlot(): TimeSlot;
    get status(): AppointmentStatus;
    get notes(): string | null;
    get clinicalNotes(): ClinicalNotes | null;
    get updatedAt(): Date;
    addClinicalNotes(clinicalNotesProps: ClinicalNotesProps, actor: ActorType): void;
    updateClinicalNotes(clinicalNotesProps: ClinicalNotesProps, actor: ActorType): void;
    confirm(actor: ActorType): void;
    cancel(actor: ActorType): void;
    reschedule(newTimeSlot: TimeSlot): void;
    private getHoursUntilAppointment;
    private _markUpdated;
    toJSON(): {
        id: string;
        patientId: string;
        doctorId: string;
        startTime: Date;
        endTime: Date;
        status: {
            value: AppointmentStatusEnum;
        };
        notes: string | null;
        clinicalNotes: ClinicalNotesProps | null;
        createdAt: Date;
        updatedAt: Date;
    };
}
//# sourceMappingURL=Appointment.d.ts.map