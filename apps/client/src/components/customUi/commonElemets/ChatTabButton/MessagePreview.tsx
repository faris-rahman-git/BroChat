import VideoCallStatus from '@client/components/customUi/commonElemets/VideoCallStatus';
import {
  LuFileText,
  LuImage,
  LuMic,
  LuPhoneIncoming,
  LuPhoneMissed,
  LuPhoneOff,
  LuPhoneOutgoing,
  LuSquareUserRound,
  LuSticker,
  LuVideo,
} from 'react-icons/lu';
import { MdLocationOn, MdOutlinePoll } from 'react-icons/md';
import { ContentType } from '@bro/shared';


interface MessagePreviewProps {
  type: ContentType;
  message?: string; // for text
  isOwn?: boolean;
}

const icons = {
  image: <LuImage className="size-4 text-black opacity-50" />,
  video: <LuVideo className="size-4 text-black opacity-50" />,
  voice: <LuMic className="size-4 text-black opacity-50" />,
  document: <LuFileText className="size-4 text-black opacity-50" />,
  gif: <LuSticker className="size-4 text-black opacity-50" />,
  contact: <LuSquareUserRound className="size-4 text-black opacity-50" />,
  poll: <MdOutlinePoll className="size-4 text-black opacity-50" />,
  location: <MdLocationOn className="size-4 text-black opacity-50" />,
  'voice-call-incoming': (
    <LuPhoneIncoming className="size-4 text-black opacity-50" />
  ),
  'voice-call-outgoing': (
    <LuPhoneOutgoing className="size-4 text-black opacity-50" />
  ),
  'voice-call-missed': (
    <LuPhoneMissed className="size-4 text-black opacity-50" />
  ),
  'voice-call-rejected': (
    <LuPhoneOff className="size-4 text-black opacity-50" />
  ),
  'video-call-incoming': (
    <VideoCallStatus type="incoming" className="size-4 text-black opacity-50" />
  ),
  'video-call-outgoing': (
    <VideoCallStatus type="outgoing" className="size-4 text-black opacity-50" />
  ),
  'video-call-missed': (
    <VideoCallStatus type="missed" className="size-4 text-black opacity-50" />
  ),
  'video-call-rejected': (
    <VideoCallStatus type="rejected" className="size-4 text-black opacity-50" />
  ),
};

const labels = {
  text: (msg?: string) => msg,
  image: (msg?: string) => msg || 'Photo',
  video: (msg?: string) => msg || 'Video',
  voice: (msg?: string) => msg || 'Voice message',
  document: (msg?: string) => msg || 'Document',
  gif: () => 'Gif',
  contact: (msg?: string) => msg || 'Contact',
  poll: (msg?: string) => msg || 'Poll',
  location: () => 'Location',
  'voice-call-incoming': () => 'Incoming Voice call',
  'voice-call-outgoing': () => 'Outgoing Voice call',
  'voice-call-missed': () => 'Missed Voice call',
  'voice-call-rejected': () => 'Rejected Voice call',
  'video-call-incoming': () => 'Incoming Voice call',
  'video-call-outgoing': () => 'Outgoing Voice call',
  'video-call-missed': () => 'Missed Voice call',
  'video-call-rejected': () => 'Rejected Voice call',
};

export default function MessagePreview({
  type,
  message,
  isOwn,
}: MessagePreviewProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground w-full">
      {type != 'text' && icons[type]}
      <span className="truncate">
        {isOwn && type !== 'text' ? 'You: ' : ''}
        {labels[type](message)}
      </span>
    </div>
  );
}
