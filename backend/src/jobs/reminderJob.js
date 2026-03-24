import cron from 'node-cron';
import { appointmentReminderCandidates } from '../controllers/appointmentController.js';
import { sendAppointmentReminder } from '../services/emailService.js';

export const startReminderJob = () => {
  cron.schedule('*/1 * * * *', async () => {
    const candidates = await appointmentReminderCandidates();
    for (const { appointment, patient, doctor } of candidates) {
      await sendAppointmentReminder({
        to: patient.email,
        patientName: patient.name,
        doctorName: doctor.name,
        slotStart: appointment.slotStart
      });
      appointment.reminderSent = true;
      await appointment.save();
    }
  });
};
