import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    specialty: { type: String, required: true, index: true },
    bio: String,
    consultationFee: Number,
    experienceYears: Number,
    rating: { type: Number, default: 4.5 }
  },
  { timestamps: true }
);

export default mongoose.model('Doctor', doctorSchema);
