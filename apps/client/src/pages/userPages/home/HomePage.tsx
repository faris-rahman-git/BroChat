import Home from '@client/components/features/user/Home';
import { getSocket } from '@client/configs/socket';
import { useLogout } from '@client/hooks/auth/useLogout';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { useSocket } from '@client/hooks/socket/useSocket';
import HomeLayout from '@client/layouts/HomeLayout';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { setError } from '@client/redux/features/userSlices/authSlices/errorSlice';
import { logout } from '@client/redux/features/userSlices/authSlices/userSlice';
import { startQueueProcessor } from '@client/services/socket/startQueueProcessor';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const dispatch = useAppDispatch();
  const { loading } = useSocket();
  const { isPending, isSuccess, mutate } = useLogout();
  const navigate = useNavigate();


  useEffect(() => {
    const isLoading = isPending || loading;
    dispatch(isLoading ? showLoader() : hideLoader());
  }, [isPending, loading]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(logout());
      navigate('/login');
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleLogout = (message: string, ack?: (status: boolean) => void) => {
      if (typeof ack === 'function') ack(true);
      dispatch(setError(message));
      mutate();
    };

    socket.on('force-logout', handleLogout);

    return () => {
      socket.off('force-logout', handleLogout);
    };
  }, []);

  // retry failed events
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

  return (
    <HomeLayout>
      <Home />
    </HomeLayout>
  );
}

export default HomePage;
