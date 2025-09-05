import CallPanel from '@client/components/customUi/user/panels/CallPanel';
import { useCallPageHook } from '@client/hooks/PageHooks/user/CallPage/useCallPageHook';
import { Navigate } from 'react-router-dom';

const CallPage = () => {
  const { roomID, isVideoCall, userDetails } = useCallPageHook();

  if (!userDetails.id || !userDetails.name || !roomID) {
    return <Navigate to="/" />;
  }

  return (
    <div className="w-full h-screen bg-gray-900 text-white flex items-center justify-center">
      <CallPanel
        roomId={roomID!}
        currentUserId={userDetails.id}
        name={userDetails.name}
        userAvatar={userDetails.avatar || ""}
        isVideoCall={isVideoCall}
      />
    </div>
  );
};

export default CallPage;
