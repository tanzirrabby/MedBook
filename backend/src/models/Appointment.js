import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    slotStart: { type: Date, required: true },
    slotEnd: { type: Date, required: true },
    status: { type: String, enum: ['booked', 'completed', 'cancelled'], default: 'booked' },
    reason: String,
    reminderSent: { type: Boolean, default: false },
    notes: String
  },
  { timestamps: true }
);

appointmentSchema.index({ doctorId: 1, slotStart: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'booked' } });

export default mongoose.model('Appointment', appointmentSchema);
