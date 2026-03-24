import { Router } from 'express';
import { getDoctorSlots, searchDoctors } from '../controllers/doctorController.js';

const router = Router();

router.get('/', searchDoctors);
router.get('/:id/slots', getDoctorSlots);

export default router;
