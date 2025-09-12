import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env['SOCKET_IO_PORT'] || 3001;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  socket.on('join_user_room', (userId: string) => {
    socket.join(userId);
    console.log(`[Socket.IO] Socket ${socket.id} joined room for user ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`[Socket.IO] Server is running on port ${PORT}`);
}); 