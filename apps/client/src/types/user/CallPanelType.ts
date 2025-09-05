import { Instance as PeerInstance } from 'simple-peer';

export type CustomPeerInstance = PeerInstance & {
  userName?: string;
  peerID?: string;
  userAvatar?: string;
};

export type UserVideoAudio = {
  video: boolean;
  audio: boolean;
}