export declare class TimeSlot {
    readonly startTime: Date;
    readonly endTime: Date;
    constructor(startTime: Date, fromPersistence?: boolean);
    private validateStartTime;
    static get slotIntervalMinutes(): number;
    private calculateEndTime;
    get bufferEndTime(): Date;
    overlaps(other: TimeSlot): boolean;
    equals(other: TimeSlot): boolean;
}
//# sourceMappingURL=TimeSlot.d.ts.map