import { Server } from 'socket.io';

let ioInstance;

export const initSocket = (server) => {
  ioInstance = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || '*' }
  });

  ioInstance.on('connection', (socket) => {
    socket.on('joinDoctorRoom', (doctorId) => socket.join(`doctor:${doctorId}`));
  });

  return ioInstance;
};

export const broadcastSlotUpdate = (doctorId, payload) => {
  if (!ioInstance) return;
  ioInstance.to(`doctor:${doctorId}`).emit('slot:update', payload);
};
