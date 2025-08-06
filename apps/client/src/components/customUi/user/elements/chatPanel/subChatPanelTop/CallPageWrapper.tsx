import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import CallPage from './CallPage';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@client/redux/store';
import { useEffect } from 'react';
import { useGetToken } from '@client/hooks/home/callHooks/useGetToken';

const CallPageWrapper = () => {
  const { roomID } = useParams();
  const [searchParams] = useSearchParams();
  const isVideoCall = searchParams.get('isVideoCall') === 'true';
  const isGroupCall = searchParams.get('isGroup') === 'true';
  const dispatch = useAppDispatch();
  const userDetails = useSelector((state: RootState) => state.user);
  const { isPending, mutate, isSuccess, data, error } = useGetToken();

  useEffect(() => {
    if (roomID) {
      mutate();
    }
  }, [roomID]);

  useEffect(() => {
    if (isPending) {
      dispatch(showLoader());
    } else {
      dispatch(hideLoader());
    }
  }, [isPending]);

  if (!roomID || error) {
    return <Navigate to="/" />;
  }

  if (!isSuccess || !data) {
    return null;
  }

  return (
    <CallPage
      userID={userDetails.id!}
      appID={data.appID}
      userName={userDetails.name ?? 'bro chat user'}
      token={data.token}
      roomID={roomID}
      isVideoCall={isVideoCall}
      isGroupCall={isGroupCall}
    />
  );
};

export default CallPageWrapper;
