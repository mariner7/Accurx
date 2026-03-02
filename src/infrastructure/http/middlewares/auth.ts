import { Request, Response, NextFunction } from 'express';
import { AuthService, TokenPayload, UserRole } from '../../../contexts/identity/domain/services/AuthService.js';

interface AuthRequest extends Request {
  user?: TokenPayload;
}

const authService = new AuthService();

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'No token provided' }
      });
      return;
    }

    const token = authHeader.substring(7);
    const payload = authService.verifyToken(token);

    (req as AuthRequest).user = payload;
    next();
  } catch {
    res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' }
    });
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      });
      return;
    }

    if (!roles.includes(authReq.user.role)) {
      res.status(403).json({
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' }
      });
      return;
    }

    next();
  };
}

export function requireDoctor(req: Request, res: Response, next: NextFunction): void {
  const authReq = req as AuthRequest;
  if (!authReq.user || authReq.user.role !== UserRole.DOCTOR) {
    res.status(403).json({
      error: { code: 'FORBIDDEN', message: 'Doctor access required' }
    });
    return;
  }
  next();
}

export function requirePatient(req: Request, res: Response, next: NextFunction): void {
  const authReq = req as AuthRequest;
  if (!authReq.user || authReq.user.role !== UserRole.PATIENT) {
    res.status(403).json({
      error: { code: 'FORBIDDEN', message: 'Patient access required' }
    });
    return;
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authReq = req as AuthRequest;
  if (!authReq.user || authReq.user.role !== UserRole.ADMIN) {
    res.status(403).json({
      error: { code: 'FORBIDDEN', message: 'Admin access required' }
    });
    return;
  }
  next();
}
