import { useCallPanelHook } from '@client/hooks/PageHooks/user/CallPage/panel/useCallPanelHook';
import React from 'react';

type ZegoCallProps = {
  userID: string;
  userName: string;
  isVideoCall: boolean;
  token: string;
  appID: number;
  roomID: string;
  isGroupCall: boolean;
};

const CallPanel: React.FC<ZegoCallProps> = ({
  userID,
  userName,
  isVideoCall = true,
  token,
  appID,
  roomID,
  isGroupCall,
}) => {
  const { containerRef } = useCallPanelHook(
    userID,
    userName,
    isVideoCall,
    token,
    appID,
    roomID,
    isGroupCall
  );

  return <div className="w-full h-screen" ref={containerRef} />;
};

export default CallPanel;
