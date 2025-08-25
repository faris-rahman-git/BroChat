import { getSocket } from '@client/configs/socket';
import { useLogoutForm } from '@client/hooks/auth/logic/useLogoutForm';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { useSocket } from '@client/hooks/socket/useSocket';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { setError } from '@client/redux/features/userSlices/authSlices/errorSlice';
import { startQueueProcessor } from '@client/services/socket/startQueueProcessor';
import { useEffect } from 'react';

export const useHomePageHook = () => {
  const dispatch = useAppDispatch();
  const { loading } = useSocket();

  const { appLogout } = useLogoutForm();

  useEffect(() => {
    dispatch(loading ? showLoader() : hideLoader());
  }, [loading]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleLogout = (message: string, ack?: (status: boolean) => void) => {
      if (typeof ack === 'function') ack(true);
      dispatch(setError(message));
      appLogout();
    };

    socket.on('force-logout', handleLogout);

    return () => {
      socket.off('force-logout', handleLogout);
    };
  }, []);

  useEffect(() => {
    const socket = getSocket();
    const trigger = async () => {
      await startQueueProcessor();
    };

    socket?.on('connect', trigger);
    window.addEventListener('online', trigger);

    return () => {
      socket?.off('connect', trigger);
      window.removeEventListener('online', trigger);
    };
  }, []);
};
