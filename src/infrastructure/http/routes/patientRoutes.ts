import { Router } from 'express';
import { patientController } from '../controllers/PatientController.js';
import { authenticate, requireDoctor } from '../middlewares/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', requireDoctor, patientController.create.bind(patientController));
router.get('/', requireDoctor, patientController.getAll.bind(patientController));
router.get('/:id', patientController.getById.bind(patientController));

export { router as patientRoutes };
