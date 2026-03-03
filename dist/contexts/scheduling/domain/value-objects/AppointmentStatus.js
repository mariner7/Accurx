export var AppointmentStatusEnum;
(function (AppointmentStatusEnum) {
    AppointmentStatusEnum["RESERVED"] = "RESERVED";
    AppointmentStatusEnum["CONFIRMED"] = "CONFIRMED";
    AppointmentStatusEnum["CANCELLED"] = "CANCELLED";
})(AppointmentStatusEnum || (AppointmentStatusEnum = {}));
export class AppointmentStatus {
    value;
    constructor(value) {
        if (!Object.values(AppointmentStatusEnum).includes(value)) {
            throw new Error(`Invalid appointment status: ${value}`);
        }
        this.value = value;
    }
    canTransitionTo(newStatus) {
        switch (this.value) {
            case AppointmentStatusEnum.RESERVED:
                return newStatus === AppointmentStatusEnum.CONFIRMED ||
                    newStatus === AppointmentStatusEnum.CANCELLED;
            case AppointmentStatusEnum.CONFIRMED:
                return newStatus === AppointmentStatusEnum.CANCELLED;
            case AppointmentStatusEnum.CANCELLED:
                return false;
            default:
                return false;
        }
    }
    canConfirm() {
        return this.canTransitionTo(AppointmentStatusEnum.CONFIRMED);
    }
    canCancel() {
        return this.canTransitionTo(AppointmentStatusEnum.CANCELLED);
    }
    equals(other) {
        return this.value === other.value;
    }
}
//# sourceMappingURL=AppointmentStatus.js.map