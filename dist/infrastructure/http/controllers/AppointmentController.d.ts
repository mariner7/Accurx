import { Request, Response, NextFunction } from 'express';
export declare class AppointmentController {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAll(_req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    confirm(req: Request, res: Response, next: NextFunction): Promise<void>;
    cancel(req: Request, res: Response, next: NextFunction): Promise<void>;
    addClinicalNotes(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const appointmentController: AppointmentController;
//# sourceMappingURL=AppointmentController.d.ts.map