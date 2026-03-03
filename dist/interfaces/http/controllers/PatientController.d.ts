import { Request, Response, NextFunction } from 'express';
export declare class PatientController {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAll(_req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const patientController: PatientController;
//# sourceMappingURL=PatientController.d.ts.map