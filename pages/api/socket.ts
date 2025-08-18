import { Server } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as HTTPServer } from 'http';
import { Socket as NetSocket } from 'net';

// Extend the NextApiResponse to include a custom socket property
interface NextApiResponseWithSocket extends NextApiResponse {
  socket: NetSocket & {
    server: HTTPServer & {
      io?: Server;
    };
  };
}

const socketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }
  
  if (res.socket.server.io) {
    console.log('[Socket.IO API] Server is already running.');
  } else {
    console.log('[Socket.IO API] Server is initializing...');
    const io = new Server(res.socket.server, {
      path: '/api/socket', // IMPORTANT: Match this with client-side connection path
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('[Socket.IO API] Client connected:', socket.id);

      socket.on('join_user_room', (userId: string) => {
        socket.join(userId);
        console.log(`[Socket.IO API] Socket ${socket.id} joined room for user ${userId}`);
      });

      socket.on('disconnect', () => {
        console.log('[Socket.IO API] Client disconnected:', socket.id);
      });
    });
    
    res.socket.server.io = io;
  }
  res.end();
};

export default socketHandler;
