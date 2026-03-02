import { Router } from 'express';
import { doctorController } from '../controllers/DoctorController.js';
import { authenticate, requireAdmin, requireRole } from '../middlewares/auth.js';
import { UserRole } from '../../../contexts/identity/domain/services/AuthService.js';

const router = Router();

router.post('/', authenticate, requireAdmin, doctorController.create.bind(doctorController));
router.get('/', doctorController.getAll.bind(doctorController));
router.get('/:id', authenticate, requireRole(UserRole.ADMIN, UserRole.DOCTOR), doctorController.getById.bind(doctorController));

export { router as doctorRoutes };
