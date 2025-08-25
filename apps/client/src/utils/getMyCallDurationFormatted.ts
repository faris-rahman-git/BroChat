import { callListType } from '@bro/shared';
export function formatDurationMs(durationMs: number): string {
  if (!durationMs) return '0:00 Min';

  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')} Min`;
}

export function getOtherUserCallDurationFormatted(call: callListType): string {
  if (!call) return '0:00 Min';

  let durationMs = 0;

  // I’m the caller → get the one receiver who’s not me
  const nonCaller = call.receivers.find(
    (r: any) => r.userId._id !== call.callerId._id
  );
  durationMs = nonCaller ? Number(nonCaller.duration) || 0 : 0;

  return formatDurationMs(durationMs);
}
