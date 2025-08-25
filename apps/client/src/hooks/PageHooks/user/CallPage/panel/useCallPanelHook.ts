import { getSocket } from '@client/configs/socket';
import { useCallEndForm } from '@client/hooks/home/callHooks/logic/useCallEndForm';
import { useCallLeftForm } from '@client/hooks/home/callHooks/logic/useCallLeftForm';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const useCallPanelHook = (
  userID: string,
  userName: string,
  isVideoCall: boolean,
  token: string,
  appID: number,
  roomID: string,
  isGroupCall: boolean
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const participants = useRef<Set<string>>(new Set());
  const totalNumberOfParticipants = useRef<Set<string>>(new Set());
  const zpRef = useRef<any>(null);

  const { callLeftMutate } = useCallLeftForm();
  const { callEndMutate } = useCallEndForm();

  // Generate token + create instance
  if (!zpRef.current) {
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
      appID,
      token,
      roomID,
      userID,
      userName
    );
    zpRef.current = ZegoUIKitPrebuilt.create(kitToken);
  }

  let someoneJoined = false;
  let noReplyTimer: NodeJS.Timeout;
  let soloTimer: NodeJS.Timeout;

  useEffect(() => {
    if (!containerRef.current || !token) {
      console.error('Invalid container or token');
      return;
    }

    // Join the room with callbacks
    zpRef.current.joinRoom({
      container: containerRef.current,
      scenario: {
        mode: isGroupCall
          ? ZegoUIKitPrebuilt.GroupCall
          : ZegoUIKitPrebuilt.OneONoneCall,
      },
      turnOnCameraWhenJoining: isVideoCall,
      showPreJoinView: false,
      showLeavingView: false,

      onUserJoin: (userList: any) => {
        userList.forEach((user: any) => {
          participants.current.add(user.userID);
          totalNumberOfParticipants.current.add(user.userID);
        });

        if (participants.current.size > 0) {
          someoneJoined = true;
          clearTimeout(noReplyTimer);
        }
        resetSoloTimer();
      },
      onUserLeave: (userList: any) => {
        userList.forEach((user: any) =>
          participants.current.delete(user.userID)
        );

        resetSoloTimer();
      },

      onLeaveRoom: () => {
        const isLastPerson = participants.current.size === 0;
        const firstUser = totalNumberOfParticipants.current.size === 0;
        setTimeout(() => {
          callLeftMutate({ roomId: roomID, leftAt: new Date() });
          if (isLastPerson) {
            callEndMutate({ roomId: roomID, endedAt: new Date(), firstUser });
          }
          zpRef.current.destroy();
          navigate('/');
        }, 100);
      },
    });

    noReplyTimer = setTimeout(() => {
      if (!someoneJoined) {
        zpRef.current.hangUp();
      }
    }, 35_000);

    const resetSoloTimer = () => {
      clearTimeout(soloTimer);
      soloTimer = setTimeout(() => {
        if (participants.current.size === 0) {
          zpRef.current.hangUp();
        }
      }, 3000);
    };

    return () => {
      clearTimeout(noReplyTimer);
      clearTimeout(soloTimer);
    };
  }, [token, userID, userName, roomID, isGroupCall]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleCallReject = async (
      {
        roomId,
      }: {
        roomId: string;
      },
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      if (roomID === roomId) {
        zpRef.current.hangUp();
      }
    };

    socket.on('call-reject', handleCallReject);

    return () => {
      socket.off('call-reject', handleCallReject);
    };
  }, []);

  return{
    containerRef
  }
};
