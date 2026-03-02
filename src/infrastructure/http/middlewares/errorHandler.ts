import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../../shared/errors/DomainError.js';
import { ZodError } from 'zod';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', err.message);

  if (err instanceof ZodError) {
    const details = err.issues.map((e) => ({
      path: e.path.map(String).join('.'),
      message: e.message
    }));
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details
      }
    });
    return;
  }

  if (err instanceof DomainError) {
    res.status(400).json({
      error: {
        code: 'DOMAIN_ERROR',
        message: err.message
      }
    });
    return;
  }

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  res.status(statusCode).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message
    }
  });
}
