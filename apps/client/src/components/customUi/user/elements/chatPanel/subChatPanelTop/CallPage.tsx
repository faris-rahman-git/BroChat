import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useNavigate } from 'react-router-dom';

type ZegoCallProps = {
  userID: string;
  userName: string;
  isVideoCall: boolean;
  token: string;
  appID: number;
  roomID: string;
  isGroupCall: boolean;
};

const CallPage: React.FC<ZegoCallProps> = ({
  userID,
  userName,
  isVideoCall = true,
  token,
  appID,
  roomID,
  isGroupCall,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
    appID,
    token,
    roomID,
    userID,
    userName
  );
  const zp = ZegoUIKitPrebuilt.create(kitToken);
  useEffect(() => {
    if (!containerRef.current) return;

    if (!token || typeof token !== 'string') {
      console.error('Token invalid:', token);
      return;
    }

    const timeout = setTimeout(() => {
      try {
        zp.joinRoom({
          container: containerRef.current,
          scenario: {
            mode: isGroupCall
              ? ZegoUIKitPrebuilt.GroupCall
              : ZegoUIKitPrebuilt.OneONoneCall,
          },
          turnOnCameraWhenJoining: isVideoCall,
          showPreJoinView: false,
          showLeavingView: false,

          onLeaveRoom: () => {
            setTimeout(() => {
              zp.destroy();
              navigate('/');
            }, 100);
          },
        });
      } catch (e) {
        console.error('Zego create() error:', e);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [token, userID, userName, roomID]);

  return <div className="w-full h-screen" ref={containerRef} />;
};

export default CallPage;
