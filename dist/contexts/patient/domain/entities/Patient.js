import { PatientId } from './PatientId.js';
import { DomainError } from '../../../../shared/errors/DomainError.js';
export var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
})(Gender || (Gender = {}));
export class Patient {
    id;
    name;
    age;
    gender;
    address;
    phone;
    email;
    allergies;
    constructor(props) {
        this.validateProps(props);
        this.id = props.id || new PatientId();
        this.name = props.name;
        this.age = props.age;
        this.gender = props.gender;
        this.address = props.address;
        this.phone = props.phone;
        this.email = props.email;
        this.allergies = props.allergies || null;
    }
    toJSON() {
        return {
            id: this.id.value,
            name: this.name,
            age: this.age,
            gender: this.gender,
            address: this.address,
            phone: this.phone,
            email: this.email,
            allergies: this.allergies
        };
    }
    validateProps(props) {
        if (!props.name || props.name.trim() === '') {
            throw new DomainError('Patient name is required');
        }
        if (props.age < 0 || props.age > 150) {
            throw new DomainError('Invalid age');
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
//# sourceMappingURL=Patient.js.map