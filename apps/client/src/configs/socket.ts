import { io, Socket } from 'socket.io-client';
import api from './axios';
import { store } from '@client/redux/store';
import { removeEventAtIndex } from '@client/redux/features/socket/offlineQueueSlice';
const AUTH_API = '/auth';

let socket: Socket | null = null;

export const initSocket = async (
  userId: string,
  onAuthFail: () => void
): Promise<Socket | null> => {
  return new Promise((resolve, reject) => {
    socket = io('https://brochatbackend.duckdns.org', {
      withCredentials: true,
      transports: ['websocket'],
      autoConnect: false,
    });

    socket.connect();

    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
      socket?.emit('user-connected', userId);

      const state = store.getState();
      const queue = [...state.offlineQueue.queue];
      if (queue.length > 0) {
        queue.forEach((eventObj, index) => {
          socket?.emit(eventObj.event, eventObj.data);
          store.dispatch(removeEventAtIndex(index));
        });
      }

      resolve(socket);
    });

    socket.on('connect_error', async (err) => {
      console.warn('Socket error:', err);

      if (
        err.message === 'Access token missing' ||
        err.message === 'Invalid access token'
      ) {
        try {
          await api.get(AUTH_API + '/refresh');
          console.log('Access token refreshed. Retrying...');
          socket?.connect();
        } catch (refreshErr) {
          console.error('Token refresh failed');
          onAuthFail();
          reject(refreshErr);
        }
      } else {
        reject(err);
      }
    });
  });
};

export const getSocket = () => socket;
