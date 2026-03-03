import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../../contexts/identity/domain/services/AuthService.js';
export declare function authenticate(req: Request, res: Response, next: NextFunction): void;
export declare function requireRole(...roles: UserRole[]): (req: Request, res: Response, next: NextFunction) => void;
export declare function requireDoctor(req: Request, res: Response, next: NextFunction): void;
export declare function requirePatient(req: Request, res: Response, next: NextFunction): void;
export declare function requireAdmin(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map