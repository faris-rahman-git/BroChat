import { Navigate } from 'react-router-dom';

import CallPanel from '@client/components/customUi/user/panels/CallPanel';
import { useCallPageHook } from '@client/hooks/PageHooks/user/CallPage/useCallPageHook';

const CallPage = () => {
  const {
    roomID,
    isVideoCall,
    isGroupCall,
    userDetails,
    isSuccess,
    data,
    error,
  } = useCallPageHook();

  if (!roomID || error) {
    return <Navigate to="/" />;
  }

  if (!isSuccess || !data) {
    return null;
  }

  return (
    <CallPanel
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

export default CallPage;
