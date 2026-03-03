import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { DomainError } from '../../../../shared/errors/DomainError.js';
export var UserRole;
(function (UserRole) {
    UserRole["PATIENT"] = "PATIENT";
    UserRole["DOCTOR"] = "DOCTOR";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (UserRole = {}));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
export class AuthService {
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
    async verifyPassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
    generateToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            patientId: user.patientId,
            doctorId: user.doctorId
        };
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
    }
    verifyToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        }
        catch {
            throw new DomainError('Invalid or expired token');
        }
    }
}
//# sourceMappingURL=AuthService.js.map