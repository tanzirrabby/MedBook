# MedBook - Doctor Appointment System

End-to-end healthcare booking platform with:

- Real-time slot availability updates (Socket.IO)
- Doctor search by specialty
- Appointment reminders via email (Nodemailer + cron)
- Patient medical history dashboard

## Tech Stack

- Frontend: React.js + Vite
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Notifications: Nodemailer

## Project Structure

- `backend/`: REST API, auth, booking, reminders, real-time events
- `frontend/`: React booking UI and patient dashboard

## Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

## Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Core API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/doctors?q=cardio`
- `GET /api/doctors/:id/slots?date=YYYY-MM-DD`
- `POST /api/appointments`
- `GET /api/appointments/me`
- `GET /api/appointments/dashboard`

## Reminder Emails

Reminder cron runs every minute and emails patients for appointments in the next 24 hours.

## Notes

- Ensure MongoDB is running.
- Configure SMTP credentials in `backend/.env` for reminder emails.
