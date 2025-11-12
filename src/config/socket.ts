import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { setupSocketHandlers } from '../socket/handlers';

export const initializeSocketIO = (httpServer: HTTPServer): SocketIOServer => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST'],
    },
    path: '/socket.io',
  });

  setupSocketHandlers(io);

  return io;
};

