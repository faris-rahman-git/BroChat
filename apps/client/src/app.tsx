import './App.css';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import Loader from './components/features/loading/Loader';
import { BrowserRouter } from 'react-router-dom';
import Routers from './router/Routers';
import { useEffect } from 'react';
import { useAppDispatch } from './hooks/commonHooks/useAppDispatch';
import { setOnline } from './redux/features/commonSlices/browserOnlineSlice';
import { getSocket } from './configs/socket';
function App() {
  const loadingStatus = useSelector((state: RootState) => state.loader.status);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleOnline = () => dispatch(setOnline(true));
    const handleOffline = () => dispatch(setOnline(false));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on('custom-ping', (data) => {
      console.log('📡 Ping from server:', data);
    });

    socket.emit('custom-pong', { time: new Date().toISOString() });

    return () => {
      socket.off('ping');
    };
  }, []);

  return (
    <BrowserRouter>
      {loadingStatus && <Loader />}
      <Routers />
    </BrowserRouter>
  );
}

export default App;
