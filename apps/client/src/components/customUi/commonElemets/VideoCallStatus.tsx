import { MdVideocam, MdMissedVideoCall, MdVideocamOff } from 'react-icons/md';
import { ImArrowDownLeft, ImArrowUpRight } from 'react-icons/im';

type VideoCallStatusProps = {
  type: 'incoming' | 'outgoing' | 'missed' | 'rejected';
  className?: string;
};

function VideoCallStatus({
  type,
  className = 'text-xl',
}: VideoCallStatusProps) {
  const renderIconWithBadge = (
    MainIcon: React.ElementType,
    BadgeIcon: React.ElementType,
    color: string
  ) => (
    <span className={`relative inline-block text-${color}`}>
      <MainIcon className={className} />
      <BadgeIcon className="absolute bottom-0 right-0 size-[8px] -translate-x-2.5 -translate-y-[8px]" />
    </span>
  );

  switch (type) {
    case 'incoming':
      return renderIconWithBadge(MdVideocam, ImArrowDownLeft, 'white');
    case 'outgoing':
      return renderIconWithBadge(MdVideocam, ImArrowUpRight, 'white');
    case 'missed':
      return <MdMissedVideoCall className={className} />;
    case 'rejected':
      return <MdVideocamOff className={className} />;
    default:
      return null;
  }
}

export default VideoCallStatus;
