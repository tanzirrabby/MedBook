import 'dotenv/config';
import { connectDB } from '../config/db.js';
import Doctor from '../models/Doctor.js';

const doctors = [
  { name: 'Ava Patel', specialty: 'Cardiology', bio: 'Heart specialist', consultationFee: 120, experienceYears: 12 },
  { name: 'Liam Chen', specialty: 'Dermatology', bio: 'Skin care expert', consultationFee: 90, experienceYears: 9 },
  { name: 'Noah Smith', specialty: 'Pediatrics', bio: 'Child specialist', consultationFee: 80, experienceYears: 7 },
  { name: 'Mia Johnson', specialty: 'Neurology', bio: 'Brain and nerve specialist', consultationFee: 150, experienceYears: 14 }
];

await connectDB();
await Doctor.deleteMany({});
await Doctor.insertMany(doctors);
console.log('Doctors seeded');
process.exit(0);
