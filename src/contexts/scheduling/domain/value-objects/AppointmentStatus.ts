export enum AppointmentStatusEnum {
  RESERVED = 'RESERVED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

export class AppointmentStatus {
  public readonly value: AppointmentStatusEnum;

  constructor(value: AppointmentStatusEnum) {
    if (!Object.values(AppointmentStatusEnum).includes(value)) {
      throw new Error(`Invalid appointment status: ${value}`);
    }
    this.value = value;
  }

  canTransitionTo(newStatus: AppointmentStatusEnum): boolean {
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

  canConfirm(): boolean {
    return this.canTransitionTo(AppointmentStatusEnum.CONFIRMED);
  }

  canCancel(): boolean {
    return this.canTransitionTo(AppointmentStatusEnum.CANCELLED);
  }

  equals(other: AppointmentStatus): boolean {
    return this.value === other.value;
  }
}
