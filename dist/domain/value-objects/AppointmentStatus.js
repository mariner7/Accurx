export var AppointmentStatusEnum;
(function (AppointmentStatusEnum) {
    AppointmentStatusEnum["SCHEDULED"] = "SCHEDULED";
    AppointmentStatusEnum["CONFIRMED"] = "CONFIRMED";
    AppointmentStatusEnum["CANCELLED"] = "CANCELLED";
    AppointmentStatusEnum["COMPLETED"] = "COMPLETED";
    AppointmentStatusEnum["NO_SHOW"] = "NO_SHOW";
})(AppointmentStatusEnum || (AppointmentStatusEnum = {}));
const ACTIVE_STATUSES = [
    AppointmentStatusEnum.SCHEDULED,
    AppointmentStatusEnum.CONFIRMED
];
const TERMINAL_STATUSES = [
    AppointmentStatusEnum.CANCELLED,
    AppointmentStatusEnum.COMPLETED,
    AppointmentStatusEnum.NO_SHOW
];
const VALID_TRANSITIONS = {
    [AppointmentStatusEnum.SCHEDULED]: [
        AppointmentStatusEnum.CONFIRMED,
        AppointmentStatusEnum.CANCELLED,
        AppointmentStatusEnum.NO_SHOW
    ],
    [AppointmentStatusEnum.CONFIRMED]: [
        AppointmentStatusEnum.CANCELLED,
        AppointmentStatusEnum.COMPLETED,
        AppointmentStatusEnum.NO_SHOW
    ],
    [AppointmentStatusEnum.CANCELLED]: [],
    [AppointmentStatusEnum.COMPLETED]: [],
    [AppointmentStatusEnum.NO_SHOW]: []
};
export class AppointmentStatus {
    value;
    constructor(value) {
        if (!Object.values(AppointmentStatusEnum).includes(value)) {
            throw new Error(`Invalid appointment status: ${value}`);
        }
        this.value = value;
    }
    canTransitionTo(newStatus) {
        const allowedTransitions = VALID_TRANSITIONS[this.value];
        return allowedTransitions.includes(newStatus);
    }
    isActive() {
        return ACTIVE_STATUSES.includes(this.value);
    }
    isTerminal() {
        return TERMINAL_STATUSES.includes(this.value);
    }
    equals(other) {
        return this.value === other.value;
    }
}
//# sourceMappingURL=AppointmentStatus.js.map