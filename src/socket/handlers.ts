import { Server as SocketIOServer, Socket } from 'socket.io';

export const setupSocketHandlers = (io: SocketIOServer): void => {
  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join user-specific room
    socket.on('join:user', (data: { userId: number }) => {
      if (data.userId) {
        socket.join(`user:${data.userId}`);
        console.log(`User ${data.userId} joined their room`);
      }
    });

    // Leave user-specific room
    socket.on('leave:user', (data: { userId: number }) => {
      if (data.userId) {
        socket.leave(`user:${data.userId}`);
        console.log(`User ${data.userId} left their room`);
      }
    });

    // Handle location updates (for client-to-server communication)
    socket.on('location:update', (data: { userId: number; latitude: number; longitude: number }) => {
      // Broadcast to all clients (or handle server-side processing)
      io.emit('location:update', {
        userId: data.userId,
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: new Date(),
      });

      // Also emit to user-specific room
      io.to(`user:${data.userId}`).emit('location:update', {
        userId: data.userId,
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: new Date(),
      });
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

