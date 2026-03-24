import mongoose from 'mongoose';

const medicalHistorySchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    allergies: [String],
    chronicConditions: [String],
    medications: [String],
    surgeries: [String],
    bloodGroup: String
  },
  { timestamps: true }
);

medicalHistorySchema.index({ patientId: 1 }, { unique: true });

export default mongoose.model('MedicalHistory', medicalHistorySchema);
