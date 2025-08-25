import { useEffect, useRef } from 'react';
import ringtone from '../../../assets/call/ringtone.m4a';

export const useCallInviteToastHook = (
  onAccept: () => void,
  onReject: () => void
) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(ringtone);
    audio.loop = true;
    audioRef.current = audio;

    audio.play().catch(() => {
      audio.muted = true;
      audio.play().then(() => {
        audio.muted = false;
      });
    });

    return () => {
      stopRingtone();
    };
  }, []);

  const stopRingtone = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleAccept = () => {
    stopRingtone();
    onAccept();
  };

  const handleReject = () => {
    stopRingtone();
    onReject();
  };

  return {
    handleReject ,
    handleAccept
  }
};
