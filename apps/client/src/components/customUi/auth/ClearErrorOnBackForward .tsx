import { useEffect } from 'react';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { clearError } from '@client/redux/features/userSlices/authSlices/errorSlice';

//clear error message on back and forward
const ClearErrorOnBackForward = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handlePopState = () => {
      dispatch(clearError());
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [dispatch]);

  return null;
};

export default ClearErrorOnBackForward;
