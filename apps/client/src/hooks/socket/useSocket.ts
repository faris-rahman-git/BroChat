import { getSocket, initSocket } from '@client/configs/socket';
import { useAppDispatch } from '../commonHooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { logout } from '@client/redux/features/userSlice';
import { Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '@client/redux/store';

export const useSocket = () => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state: RootState) => state.user?.id);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthFail = () => {
      dispatch(logout());
      navigate('/login');
    };

    const setup = async () => {
      const connected = await initSocket(userId as string, handleAuthFail);
      setSocketInstance(connected);
      setLoading(false);
    };

    if (!getSocket()) {
      setup();
    } else {
      setSocketInstance(getSocket());
      setLoading(false);
    }
  }, []);

  return { socket: socketInstance, loading };
};
