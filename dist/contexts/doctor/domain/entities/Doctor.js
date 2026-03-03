import { DoctorId } from './DoctorId.js';
import { DomainError } from '../../../../shared/errors/DomainError.js';
export class Doctor {
    id;
    name;
    specialty;
    licenseNumber;
    phone;
    email;
    constructor(props) {
        this.validateProps(props);
        this.id = props.id || new DoctorId();
        this.name = props.name;
        this.specialty = props.specialty;
        this.licenseNumber = props.licenseNumber;
        this.phone = props.phone;
        this.email = props.email;
    }
    toJSON() {
        return {
            id: this.id.value,
            name: this.name,
            specialty: this.specialty,
            licenseNumber: this.licenseNumber,
            phone: this.phone,
            email: this.email
        };
    }
    validateProps(props) {
        if (!props.name || props.name.trim() === '') {
            throw new DomainError('Doctor name is required');
        }
        if (!props.specialty || props.specialty.trim() === '') {
            throw new DomainError('Doctor specialty is required');
        }
        if (!props.licenseNumber || props.licenseNumber.trim() === '') {
            throw new DomainError('Doctor license number is required');
        }
        if (!props.email || !this.isValidEmail(props.email)) {
            throw new DomainError('Invalid email format');
        }
    }
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
//# sourceMappingURL=Doctor.js.map