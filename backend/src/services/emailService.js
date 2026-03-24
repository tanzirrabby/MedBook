import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendAppointmentReminder = async ({ to, patientName, doctorName, slotStart }) => {
  if (!process.env.SMTP_HOST || !to) return;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to,
    subject: 'MedBook Appointment Reminder',
    text: `Hi ${patientName}, reminder for your appointment with Dr. ${doctorName} at ${new Date(slotStart).toLocaleString()}.`
  });
};
