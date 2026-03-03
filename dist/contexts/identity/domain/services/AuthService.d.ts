export declare enum UserRole {
    PATIENT = "PATIENT",
    DOCTOR = "DOCTOR",
    ADMIN = "ADMIN"
}
export interface User {
    id: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    patientId?: string;
    doctorId?: string;
}
export interface TokenPayload {
    id: string;
    email: string;
    role: UserRole;
    patientId?: string;
    doctorId?: string;
}
export interface AuthResult {
    token: string;
    user: Omit<User, 'passwordHash'>;
}
export declare class AuthService {
    hashPassword(password: string): Promise<string>;
    verifyPassword(password: string, hash: string): Promise<boolean>;
    generateToken(user: Omit<User, 'passwordHash'>): string;
    verifyToken(token: string): TokenPayload;
}
//# sourceMappingURL=AuthService.d.ts.map