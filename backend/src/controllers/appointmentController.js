import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import { broadcastSlotUpdate } from '../sockets/index.js';

export const bookAppointment = async (req, res) => {
  const { doctorId, slotStart, reason } = req.body;
  const start = new Date(slotStart);
  const end = new Date(start.getTime() + 30 * 60 * 1000);

  try {
    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      slotStart: start,
      slotEnd: end,
      reason
    });

    broadcastSlotUpdate(doctorId, { slotStart: start, available: false });
    return res.status(201).json(appointment);
  } catch {
    return res.status(409).json({ message: 'Slot already booked' });
  }
};

export const getMyAppointments = async (req, res) => {
  const appointments = await Appointment.find({ patientId: req.user.id })
    .populate('doctorId', 'name specialty')
    .sort({ slotStart: 1 });
  return res.json(appointments);
};

export const getDashboard = async (req, res) => {
  const appointments = await Appointment.find({ patientId: req.user.id })
    .populate('doctorId', 'name specialty')
    .sort({ slotStart: -1 })
    .limit(20);

  const stats = {
    totalAppointments: appointments.length,
    upcoming: appointments.filter((a) => a.status === 'booked' && new Date(a.slotStart) > new Date()).length,
    completed: appointments.filter((a) => a.status === 'completed').length
  };

  return res.json({ stats, recentAppointments: appointments });
};

export const appointmentReminderCandidates = async () => {
  const now = new Date();
  const upcomingWindow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const appointments = await Appointment.find({
    status: 'booked',
    reminderSent: false,
    slotStart: { $gte: now, $lte: upcomingWindow }
  });

  const enriched = [];
  for (const appointment of appointments) {
    const [patient, doctor] = await Promise.all([
      User.findById(appointment.patientId),
      Doctor.findById(appointment.doctorId)
    ]);
    if (patient && doctor) enriched.push({ appointment, patient, doctor });
  }
  return enriched;
};
