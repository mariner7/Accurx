export declare class TimeSlot {
    readonly startTime: Date;
    readonly endTime: Date;
    constructor(startTime: Date, endTime: Date);
    private validate;
    overlaps(other: TimeSlot): boolean;
    equals(other: TimeSlot): boolean;
}
//# sourceMappingURL=TimeSlot.d.ts.map