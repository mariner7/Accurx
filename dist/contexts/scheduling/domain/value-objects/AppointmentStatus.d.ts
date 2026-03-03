export declare enum AppointmentStatusEnum {
    RESERVED = "RESERVED",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED"
}
export declare class AppointmentStatus {
    readonly value: AppointmentStatusEnum;
    constructor(value: AppointmentStatusEnum);
    canTransitionTo(newStatus: AppointmentStatusEnum): boolean;
    canConfirm(): boolean;
    canCancel(): boolean;
    equals(other: AppointmentStatus): boolean;
}
//# sourceMappingURL=AppointmentStatus.d.ts.map