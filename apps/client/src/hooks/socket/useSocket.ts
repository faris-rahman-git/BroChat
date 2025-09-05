import { getSocket, initSocket } from '@client/configs/socket';
import { useAppDispatch } from '../commonHooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '@client/redux/store';
import { logout } from '@client/redux/features/userSlices/authSlices/userSlice';

export const useSocket = () => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);
  const userDetails = useSelector((state: RootState) => state.user);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthFail = () => {
      dispatch(logout());
      navigate('/login');
    };

    const setup = async () => {
      if (!userDetails.id || userDetails.role !== 'user') {
        setLoading(false);
        return;
      }

      const connected = await initSocket(
        userDetails.id as string,
        handleAuthFail
      );
      setSocketInstance(connected);
      setLoading(false);
    };

    if (!getSocket()) {
      setup();
    } else {
      setSocketInstance(getSocket());
      setLoading(false);
    }
  }, [userDetails, dispatch, navigate]);

  return { socket: socketInstance, loading };
};
