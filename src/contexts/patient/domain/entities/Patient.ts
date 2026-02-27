import { PatientId } from './PatientId.js';
import { DomainError } from '../../../../shared/errors/DomainError.js';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
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

export class Patient {
  public readonly id: PatientId;
  public readonly name: string;
  public readonly age: number;
  public readonly gender: Gender;
  public readonly address: string;
  public readonly phone: string;
  public readonly email: string;
  public readonly allergies: string | null;

  constructor(props: PatientProps) {
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

  private validateProps(props: PatientProps): void {
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

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
