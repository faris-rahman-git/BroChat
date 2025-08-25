import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import {
  logout,
  setUser,
  setLoading,
} from '@client/redux/features/userSlices/authSlices/userSlice';
import { setError } from '@client/redux/features/userSlices/authSlices/errorSlice';

function useSocialAuthFromQuery() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userString = params.get('user');
    const errorMessage = params.get('message');

    if (errorMessage) {
      dispatch(setError(decodeURIComponent(errorMessage)));
      dispatch(logout());
      navigate('/login');
      return;
    }

    if (userString) {
      try {
        const user = JSON.parse(decodeURIComponent(userString));
        dispatch(setUser({ user }));
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      } catch (err) {
        console.error('Failed to parse user', err);
        dispatch(setError('Invalid login response.'));
        dispatch(logout());
        navigate('/login');
      }
    }

    dispatch(setLoading({ loading: false }));
  }, [dispatch, navigate]);
}

export default useSocialAuthFromQuery;
