import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import Loader from './components/features/loading/Loader';
import { BrowserRouter } from 'react-router-dom';
import Routers from './router/Routers';
import './App.css';
import { useEffect } from 'react';
import { useAppDispatch } from './hooks/commonHooks/useAppDispatch';
import { setOnline } from './redux/features/browserOnlineSlice';

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

  return (
    <BrowserRouter>
      {loadingStatus && <Loader />}
      <Routers />
    </BrowserRouter>
  );
}

export default App;
