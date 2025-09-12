'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './use-auth';
import { useAppDispatch } from './use-redux';
import { updateUploadTaskStatus, UploadTask } from '@/store/features/uploadSlice';
import { candidateApi } from '@/services/api/candidateApi';

let socket: Socket | null = null;
const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:3001';


// Define the shape of the data received from the socket
interface UploadStatusData {
    taskId: string;
    status: UploadTask['status'];
    error?: string;
    analysis?: any; // We can type this better later
}

export function useSocket() {
  const { session } = useAuth();
  const dispatch = useAppDispatch();
  const [isConnected, setIsConnected] = useState(socket?.connected || false);

  useEffect(() => {
    const initializeSocket = () => {
      // No need to fetch anymore, we connect directly.
      // await fetch('/api/socket');

      if (!socket) {
        // Connect to the standalone Socket.IO server
        socket = io(SOCKET_SERVER_URL);

        socket.on('connect', () => {
          console.log('[Socket.IO] Connected to server.');
          setIsConnected(true);
          if (session?.user?.id) {
            socket?.emit('join_user_room', session.user.id);
          }
        });

        socket.on('disconnect', () => {
          console.log('[Socket.IO] Disconnected from server.');
          setIsConnected(false);
        });

        // Listen for the unified 'upload_status' event
        socket.on('upload_status', (data: UploadStatusData) => {
            console.log('[Socket.IO] Received upload_status:', data);
            dispatch(updateUploadTaskStatus({ 
                id: data.taskId, 
                status: data.status, 
                error: data.error,
                analysisResult: data.analysis,
            }));

            // If the upload was successful, invalidate the cache for the candidate list
            if (data.status === 'success') {
                dispatch(candidateApi.util.invalidateTags([{ type: 'Candidates', id: 'LIST' }]));
            }
        });

      }
    };

    if (session?.user?.id) {
      if (!socket) {
        initializeSocket();
      } else if (socket.connected) {
        socket.emit('join_user_room', session.user.id);
      }
    }
    
  }, [session, dispatch]);

  return { socket, isConnected };
}
