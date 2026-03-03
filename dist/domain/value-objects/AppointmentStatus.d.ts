export declare enum AppointmentStatusEnum {
    SCHEDULED = "SCHEDULED",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED",
    NO_SHOW = "NO_SHOW"
}
export declare class AppointmentStatus {
    readonly value: AppointmentStatusEnum;
    constructor(value: AppointmentStatusEnum);
    canTransitionTo(newStatus: AppointmentStatusEnum): boolean;
    isActive(): boolean;
    isTerminal(): boolean;
    equals(other: AppointmentStatus): boolean;
}
//# sourceMappingURL=AppointmentStatus.d.ts.map