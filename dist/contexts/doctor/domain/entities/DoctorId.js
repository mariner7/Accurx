import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { DomainError } from '../../../../shared/errors/DomainError.js';
export class DoctorId {
    _value;
    constructor(value) {
        if (value) {
            if (!uuidValidate(value)) {
                throw new DomainError('Invalid UUID format for DoctorId');
            }
            this._value = value;
        }
        else {
            this._value = uuidv4();
        }
    }
    get value() {
        return this._value;
    }
    equals(other) {
        return this._value === other._value;
    }
    toString() {
        return this._value;
    }
}
//# sourceMappingURL=DoctorId.js.map