import { DoctorId } from './DoctorId.js';
export interface DoctorProps {
    id?: DoctorId;
    name: string;
    specialty: string;
    licenseNumber: string;
    phone: string;
    email: string;
}
export declare class Doctor {
    readonly id: DoctorId;
    readonly name: string;
    readonly specialty: string;
    readonly licenseNumber: string;
    readonly phone: string;
    readonly email: string;
    constructor(props: DoctorProps);
    toJSON(): {
        id: string;
        name: string;
        specialty: string;
        licenseNumber: string;
        phone: string;
        email: string;
    };
    private validateProps;
    private isValidEmail;
}
//# sourceMappingURL=Doctor.d.ts.map