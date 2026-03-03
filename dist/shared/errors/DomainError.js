export class DomainError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DomainError';
        Error.captureStackTrace(this, this.constructor);
    }
}
//# sourceMappingURL=DomainError.js.map