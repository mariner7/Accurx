import { PatientId } from './PatientId.js';
export declare enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE"
}
export interface PatientProps {
    id?: PatientId;
    name: string;
    age: number;
    gender: Gender;
    address: string;
    phone: string;
    email: string;
    allergies?: string;
}
export declare class Patient {
    readonly id: PatientId;
    readonly name: string;
    readonly age: number;
    readonly gender: Gender;
    readonly address: string;
    readonly phone: string;
    readonly email: string;
    readonly allergies: string | null;
    constructor(props: PatientProps);
    toJSON(): {
        id: string;
        name: string;
        age: number;
        gender: Gender;
        address: string;
        phone: string;
        email: string;
        allergies: string | null;
    };
    private validateProps;
    private isValidEmail;
}
//# sourceMappingURL=Patient.d.ts.map