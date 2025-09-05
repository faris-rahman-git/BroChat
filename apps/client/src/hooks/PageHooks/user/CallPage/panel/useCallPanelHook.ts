import { useState, useEffect, useRef } from 'react';
import Peer, { Instance as PeerInstance } from 'simple-peer';
import { getSocket } from '@client/configs/socket';
import { callInfoType } from '@bro/shared';
import {
  CustomPeerInstance,
  UserVideoAudio,
} from '@client/types/user/CallPanelType';
import { useNavigate } from 'react-router-dom';

interface PeerInfo {
  peerID: string;
  peer: CustomPeerInstance;
  userName: string;
  userAvatar?: string;
}

export const useCallPanelHook = (
  roomId: string,
  currentUserId: string,
  isVideoCall: boolean
) => {
  const [peers, setPeers] = useState<CustomPeerInstance[]>([]);
  const [userVideoAudio, setUserVideoAudio] = useState<
    Record<string, UserVideoAudio>
  >({
    [currentUserId]: { video: isVideoCall, audio: true },
  });
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const userStream = useRef<MediaStream | null>(null);
  const peersRef = useRef<PeerInfo[]>([]);
  const navigate = useNavigate();
  const firstJoinRef = useRef(false);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleCallReject = async (
      data: { roomId: string },
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      if (data.roomId === roomId) {
        goToBack();
      }
    };

    socket.on('call-end', handleCallReject);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (peersRef.current.length === 0) {
        goToBack();
      }
    }, 30_000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!firstJoinRef.current) {
      if (peers.length > 0) {
        firstJoinRef.current = true;
      } else {
        return;
      }
    }

    let timer: ReturnType<typeof setTimeout> | null = null;

    if (firstJoinRef.current && peers.length === 0) {
      timer = setTimeout(() => {
        goToBack();
      }, 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [peers]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    window.addEventListener('popstate', goToBack);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (!isVideoCall) {
          // disable video track initially
          stream.getVideoTracks().forEach((track) => (track.enabled = false));
        }
        if (userVideoRef.current) userVideoRef.current.srcObject = stream;
        userStream.current = stream;

        socket.emit('web-join-room', { roomId, isVideoCall });
      });

    // --- Handlers ---
    const handleUserJoin = (
      users: {
        userId: string;
        info: callInfoType;
      }[],
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      const newPeers: PeerInstance[] = [];
      users.forEach(({ userId, info }) => {
        if (userId === currentUserId) return;
        if (findPeer(userId)) return; // already connected

        // only the *new joiner* calls createPeer
        const peer = createPeer(userId, currentUserId, userStream.current!);

        (peer as any).userName = info.userName;
        (peer as any).userAvatar = info.userAvatar;
        (peer as any).peerID = userId;

        peersRef.current.push({
          peerID: userId,
          peer,
          userName: info.userName,
          userAvatar: info.userAvatar,
        });
        newPeers.push(peer);

        setUserVideoAudio((prev) => ({
          ...prev,
          [userId]: {
            video: info.video,
            audio: info.audio,
          },
        }));
      });

      if (newPeers.length > 0) setPeers((prev) => [...prev, ...newPeers]);
    };

    const handleReceiveCall = ({
      signal,
      from,
      info,
    }: {
      signal: any;
      from: string;
      info: callInfoType;
    }) => {
      const existing = findPeer(from);

      if (existing) {
        // Already connected, just pass signal
        existing.peer.signal(signal);
        return;
      }

      const peer = addPeer(signal, from, userStream.current!);

      (peer as any).userName = info.userName;
      (peer as any).userAvatar = info.userAvatar;
      (peer as any).peerID = from;

      peersRef.current.push({
        peerID: from,
        peer,
        userName: info.userName,
        userAvatar: info.userAvatar,
      });
      setPeers((prev) => [...prev, peer]);

      setUserVideoAudio((prev) => ({
        ...prev,
        [from]: {
          video: info.video,
          audio: info.audio,
        },
      }));
    };

    const handleCallAccepted = ({
      signal,
      answerId,
    }: {
      signal: any;
      answerId: string;
    }) => {
      const peerInfo = findPeer(answerId);
      if (peerInfo) {
        peerInfo.peer.signal(signal);
      }
    };

    const handleUserLeave = ({ userId }: { userId: string }) => {
      const peerInfo = findPeer(userId);
      if (!peerInfo) return;

      peerInfo.peer.destroy();
      peersRef.current = peersRef.current.filter((p) => p.peerID !== userId);
      setPeers((prev) => prev.filter((p: any) => p.peerID !== userId));
    };

    const handleToggleCamera = ({
      userId,
      switchTarget,
    }: {
      userId: string;
      switchTarget: 'video' | 'audio';
    }) => {
      setUserVideoAudio((prev) => {
        const existing = prev[userId];
        if (!existing) return prev;

        const newState = { ...existing };

        if (switchTarget === 'video') {
          newState.video = !existing.video;

          // Only apply track toggle if it's THIS user
          if (userId === currentUserId) {
            const track =
              userVideoRef.current?.srcObject instanceof MediaStream
                ? userVideoRef.current.srcObject.getVideoTracks()[0]
                : null;
            if (track) track.enabled = newState.video;
          }
        } else {
          newState.audio = !existing.audio;

          if (userId === currentUserId) {
            const track =
              userVideoRef.current?.srcObject instanceof MediaStream
                ? userVideoRef.current.srcObject.getAudioTracks()[0]
                : null;
            if (track) track.enabled = newState.audio;
            else if (userStream.current) {
              userStream.current.getAudioTracks()[0].enabled = newState.audio;
            }
          }
        }

        return {
          ...prev,
          [userId]: newState,
        };
      });
    };

    const handleCallAlreadyEnded = async (
      data: { roomId: string },
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      if (data.roomId === roomId) {
        navigate('/');
      }
    };

    // --- Socket Listeners ---
    socket.on('web-toggle-camera', handleToggleCamera);
    socket.on('web-user-join', handleUserJoin);
    socket.on('web-receive-call', handleReceiveCall);
    socket.on('web-call-accepted', handleCallAccepted);
    socket.on('web-user-leave', handleUserLeave);
    socket.on('web-call-already-ended', handleCallAlreadyEnded);

    return () => {
      // --- Cleanup ---
      socket.off('web-toggle-camera', handleToggleCamera);
      socket.off('web-user-join', handleUserJoin);
      socket.off('web-receive-call', handleReceiveCall);
      socket.off('web-call-accepted', handleCallAccepted);
      socket.off('web-user-leave', handleUserLeave);
      socket.off('web-call-already-ended', handleUserLeave);
      window.removeEventListener('popstate', goToBack);
    };
  }, []);

  // --- Peer Management ---
  function createPeer(
    userId: string,
    caller: string,
    stream: MediaStream
  ): PeerInstance {
    const socket = getSocket();
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });
    peer.on('signal', (signal) => {
      socket?.emit('web-call-user', {
        userToCall: userId,
        from: caller,
        signal,
      });
    });

    peer.on('disconnect', () => peer.destroy());
    peer.on('error', (err) => console.error('[PEER ERROR] createPeer:', err));

    return peer;
  }

  function addPeer(
    incomingSignal: any,
    callerId: string,
    stream: MediaStream
  ): PeerInstance {
    const socket = getSocket();
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socket?.emit('web-accept-call', { signal, to: callerId });
    });

    peer.on('disconnect', () => {
      peer.destroy();
    });
    peer.on('error', (err) => console.error('[PEER ERROR] addPeer:', err)); // Good practice

    peer.signal(incomingSignal);

    return peer;
  }

  function findPeer(id: string): PeerInfo | undefined {
    return peersRef.current.find((p) => p.peerID === id);
  }

  const goToBack = (e?: any) => {
    e?.preventDefault();
    const socket = getSocket();
    socket?.emit('web-leave-room', { roomId, leaver: currentUserId });
    navigate('/');
  };

  const toggleCameraAudio = (e: any) => {
    const socket = getSocket();
    const target = e.currentTarget.getAttribute('data-switch') as
      | 'video'
      | 'audio';

    // just tell server
    socket?.emit('web-toggle-camera-audio', { roomId, switchTarget: target });
  };

  return {
    peers,
    userVideoAudio,
    toggleCameraAudio,
    goToBack,
    userVideoRef,
  };
};
