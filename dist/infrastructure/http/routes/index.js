import { Router } from 'express';
import { authRoutes } from './authRoutes.js';
import { appointmentRoutes } from './appointmentRoutes.js';
import { patientRoutes } from './patientRoutes.js';
import { doctorRoutes } from './doctorRoutes.js';
const router = Router();
router.use('/auth', authRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
export { router as apiRoutes };
//# sourceMappingURL=index.js.map