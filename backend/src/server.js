import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import { initSocket } from './sockets/index.js';
import { startReminderJob } from './jobs/reminderJob.js';

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

app.get('/health', (_, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  initSocket(server);
  startReminderJob();
  server.listen(PORT, () => console.log(`API on ${PORT}`));
})();
