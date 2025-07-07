import { cn } from '@client/lib/utils';
import { LuClock } from 'react-icons/lu';
import { MdDone, MdDoneAll } from 'react-icons/md';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@client/components/ui/avatar';
import { useEffect, useRef, useState } from 'react';
import { MessageStatusType } from '@bro/shared';

type Props = {
  isMine: boolean;
  message: string;
  time: string;
  status?: MessageStatusType;
  avatarUrl?: string;
  showAvatar?: boolean;
};

const MessageBubble = ({
  isMine,
  message,
  time,
  status = 'sent',
  avatarUrl,
  showAvatar = true,
}: Props) => {
  const messageRef = useRef<HTMLParagraphElement>(null);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    if (messageRef.current) {
      setIsNarrow(messageRef.current.offsetWidth < 300);
    }
  }, [message]);

  const renderStatusIcon = () => {
    if (status === 'sending') return <LuClock className="size-3" />;
    if (status === 'sent') return <MdDone className="size-3" />;
    if (status === 'delivered' || status === 'seen') {
      return (
        <MdDoneAll
          className={cn('size-3', status === 'seen' ? 'text-blue-400' : '')}
        />
      );
    }
    return null;
  };

  return (
    <div
      className={cn(
        'flex w-full gap-2',
        isMine ? 'justify-end' : 'justify-start'
      )}
    >
      {!isMine && (
        <div className="min-w-6 h-6">
          {showAvatar ? (
            <Avatar className="size-6 self-end">
              <AvatarImage src={avatarUrl} alt="avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          ) : (
            <div className="size-6 opacity-0 pointer-events-none" />
          )}
        </div>
      )}
      <div
        className={cn(
          'relative max-w-[65%] min-w-[100px] rounded-[6px] px-4 pt-2 pb-5 text-sm whitespace-pre-wrap break-words',
          isMine
            ? 'bg-[#615EF0] text-white rounded-tr-none'
            : 'bg-white text-black rounded-tl-none'
        )}
      >
        <p
          ref={messageRef}
          className={cn(
            ' break-all select-text',
            isMine && isNarrow ? 'pe-3' : ''
          )}
        >
          {message}
        </p>
        <span
          className={cn(
            'absolute bottom-[4px] right-[10px] flex items-center gap-[2px] text-[10px]',
            isMine ? 'text-white/70' : 'text-black/60'
          )}
        >
          <span>{time}</span>
          {isMine && renderStatusIcon()}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
