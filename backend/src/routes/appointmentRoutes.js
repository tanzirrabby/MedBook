import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { bookAppointment, getDashboard, getMyAppointments } from '../controllers/appointmentController.js';

const router = Router();

router.post('/', auth, bookAppointment);
router.get('/me', auth, getMyAppointments);
router.get('/dashboard', auth, getDashboard);

export default router;
