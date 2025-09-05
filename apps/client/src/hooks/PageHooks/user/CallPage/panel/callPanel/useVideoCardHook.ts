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
    // When the peer's stream is received, attach it to the video element.
    const handleStream = (stream: MediaStream) => {
      if (ref.current) {
        // 1. Set the video source
        ref.current.srcObject = stream; // 2. *** THE FIX: Attach the video element reference to the peer object. *** // This allows the parent component (useCallPanelHook) to access it.
        (peer as any).videoElement = ref.current;
      }
    };

    peer.on('stream', handleStream); // Optional but good practice: Add a cleanup function to remove the listener
    return () => {
      peer.off('stream', handleStream);
    };
  }, [peer]);

  return { ref, info, userAvatar, name };
};
