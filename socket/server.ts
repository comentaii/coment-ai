import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

// Extend the NodeJS.Global interface to declare a new property
declare global {
  var io: SocketIOServer | undefined;
}

export const getSocketServer = () => {
  if (!global.io) {
    throw new Error('Socket.IO server has not been initialized.');
  }
  return global.io;
};

export function createSocketServer(httpServer: HTTPServer) {
  if (global.io) {
    console.log('[Socket.IO] Server already running.');
    return global.io;
  }

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('[Socket.IO] Client connected:', socket.id);

    socket.on('join_user_room', (userId: string) => {
      socket.join(userId);
      console.log(`[Socket.IO] Socket ${socket.id} joined room for user ${userId}`);
    });

    socket.on('disconnect', () => {
      console.log('[Socket.IO] Client disconnected:', socket.id);
    });
  });

  console.log('[Socket.IO] Server created and running.');
  global.io = io;
  return io;
} 