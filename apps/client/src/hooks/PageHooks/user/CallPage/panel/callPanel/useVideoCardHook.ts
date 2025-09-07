import {
  CustomPeerInstance,
  UserVideoAudio,
} from '@client/types/user/CallPanelType';
import { useRef, useEffect } from 'react';

export const useVideoCardHook = (
  peer: CustomPeerInstance,
  userVideoAudio: Record<string, UserVideoAudio>
) => {
  const ref = useRef<HTMLVideoElement>(null);
  const userId = peer.peerID!;
  const info = userVideoAudio[userId];

  const userAvatar = peer.userAvatar;
  const name = peer.userName;

  useEffect(() => {
    const handleStream = (stream: MediaStream) => {
      if (ref.current) {
        ref.current.srcObject = stream;
        peer.videoElement = ref.current;
      }
    };

    peer.on('stream', handleStream);
    return () => {
      peer.off('stream', handleStream);
    };
  }, [peer]);

  return { ref, info, userAvatar, name };
};
