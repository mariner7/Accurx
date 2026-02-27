import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { DomainError } from '../../../../shared/errors/DomainError.js';

export class PatientId {
  private readonly _value: string;

  constructor(value?: string) {
    if (value) {
      if (!uuidValidate(value)) {
        throw new DomainError('Invalid UUID format for PatientId');
      }
      this._value = value;
    } else {
      this._value = uuidv4();
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: PatientId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
