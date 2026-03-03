import { Request, Response, NextFunction } from 'express';
export declare class DoctorController {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAll(_req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const doctorController: DoctorController;
//# sourceMappingURL=DoctorController.d.ts.map