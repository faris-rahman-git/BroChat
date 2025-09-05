import { RootState } from '@client/redux/store';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

export const useCallPageHook = () => {
  const { roomID } = useParams();
  const [searchParams] = useSearchParams();
  const isVideoCall = searchParams.get('isVideoCall') === 'true';
  const userDetails = useSelector((state: RootState) => state.user);

  return {
    roomID,
    isVideoCall,
    userDetails,
  };
};
