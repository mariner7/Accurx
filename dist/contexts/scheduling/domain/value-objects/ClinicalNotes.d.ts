export interface ClinicalNotesProps {
    observations: string;
    diagnosis: string | null;
    treatment: string | null;
    followUp: string | null;
}
export declare class ClinicalNotes {
    readonly observations: string;
    readonly diagnosis: string | null;
    readonly treatment: string | null;
    readonly followUp: string | null;
    constructor(props: ClinicalNotesProps);
    private validate;
    isComplete(): boolean;
    toPlainObject(): ClinicalNotesProps;
}
//# sourceMappingURL=ClinicalNotes.d.ts.map