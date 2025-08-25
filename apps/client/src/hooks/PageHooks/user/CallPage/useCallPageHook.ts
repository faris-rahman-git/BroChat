import { useGetTokenForm } from '@client/hooks/home/callHooks/logic/useGetTokenForm';
import { RootState } from '@client/redux/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

export const useCallPageHook = () => {
  const { roomID } = useParams();
  const [searchParams] = useSearchParams();
  const isVideoCall = searchParams.get('isVideoCall') === 'true';
  const isGroupCall = searchParams.get('isGroup') === 'true';
  const userDetails = useSelector((state: RootState) => state.user);

  const { mutate, isSuccess, data, error } = useGetTokenForm();

  useEffect(() => {
    if (roomID) {
      mutate();
    }
  }, [roomID]);

  return {
    roomID,
    isVideoCall,
    isGroupCall,
    userDetails,
    isSuccess,
    data,
    error,
  };
};
