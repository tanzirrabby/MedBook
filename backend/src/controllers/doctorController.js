import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

export const searchDoctors = async (req, res) => {
  const { specialty, q } = req.query;
  const query = {};

  if (specialty) query.specialty = new RegExp(`^${specialty}$`, 'i');
  if (q) query.$or = [{ name: { $regex: q, $options: 'i' } }, { specialty: { $regex: q, $options: 'i' } }];

  const doctors = await Doctor.find(query).sort({ rating: -1 });
  return res.json(doctors);
};

export const getDoctorSlots = async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: 'date query is required (YYYY-MM-DD)' });

  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(`${date}T23:59:59.999Z`);

  const appointments = await Appointment.find({
    doctorId: id,
    status: 'booked',
    slotStart: { $gte: start, $lte: end }
  }).select('slotStart');

  const booked = new Set(appointments.map((a) => a.slotStart.toISOString()));
  const defaultSlots = Array.from({ length: 8 }).map((_, i) => {
    const d = new Date(start);
    d.setUTCHours(9 + i, 0, 0, 0);
    return d;
  });

  const slots = defaultSlots.map((s) => ({ start: s, available: !booked.has(s.toISOString()) }));
  return res.json(slots);
};
