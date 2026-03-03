import { Router } from 'express';
import { appointmentController } from '../controllers/AppointmentController.js';
import { authenticate, requireDoctor } from '../middlewares/auth.js';
const router = Router();
router.use(authenticate);
router.post('/', appointmentController.create.bind(appointmentController));
router.get('/', appointmentController.getAll.bind(appointmentController));
router.get('/:id', appointmentController.getById.bind(appointmentController));
router.put('/:id', appointmentController.update.bind(appointmentController));
router.post('/:id/confirm', requireDoctor, appointmentController.confirm.bind(appointmentController));
router.post('/:id/cancel', appointmentController.cancel.bind(appointmentController));
router.post('/:id/clinical-notes', requireDoctor, appointmentController.addClinicalNotes.bind(appointmentController));
export { router as appointmentRoutes };
//# sourceMappingURL=appointmentRoutes.js.map