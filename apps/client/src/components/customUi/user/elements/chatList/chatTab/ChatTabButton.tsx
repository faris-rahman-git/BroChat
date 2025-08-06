import { Button } from '@client/components/ui/button';
import { Badge } from '@client/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { cn } from '@client/lib/utils';
import MessagePreview from './MessagePreview';
import { ContentType } from '@bro/shared';
import { BsPatchCheckFill } from 'react-icons/bs';

type ChatTabButtonProps = {
  avatar?: string;
  chatName: string;
  lastMessageOrUserName: string;
  ContentType?: ContentType;
  unreadCount?: number;
  isTyping?: boolean;
  onlineStatus?: boolean;
  isAddUser?: boolean;
  className?: string;
  timeOrText?: string;
  avatarFallback?: string;
  isPaid?: boolean;
  isSubscribed?: boolean;
} & React.ComponentProps<typeof Button>;

export default function ChatTabButton({
  avatar,
  chatName,
  lastMessageOrUserName,
  ContentType = 'text',
  unreadCount = 0,
  isTyping = false,
  onlineStatus = false,
  isAddUser = false,
  className,
  timeOrText,
  avatarFallback,
  isPaid = false,
  isSubscribed = false,
  ...props
}: ChatTabButtonProps) {
  return (
    <>
      <Button
        variant="ghost"
        className={cn(
          'gap-4 p-3 flex items-start self-stretch w-full h-auto justify-start hover:cursor-pointer',
          className
        )}
        {...props}
      >
        {/* Avatar and online status */}
        <div className="relative size-[45px] flex-shrink-0 rounded-[6px] overflow-hidden">
          <Avatar className="size-full flex justify-center items-center bg-[#c9c9c9]">
            <AvatarImage
              src={avatar}
              alt={chatName}
              className="object-cover size-full"
            />
            <AvatarFallback className="text-center">
              {avatarFallback
                ? avatarFallback
                : chatName.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          {onlineStatus && (
            <div className="absolute w-[15px] h-[15px] bottom-[-1.5px] right-[-1.5px] bg-red-700 rounded-full border-2 border-white" />
          )}
        </div>

        {/* Chat content */}
        <div className="w-full h-12 flex flex-col items-start justify-center gap-2 flex-1 text-left overflow-hidden">
          <div className="flex w-full flex-col items-start justify-center">
            {/* Chat name and time */}
            <div className="flex items-center justify-between w-full gap-2">
              <div className="flex items-center gap-2 truncate font-semibold text-black text-sm">
                {chatName}
                {(isPaid || isSubscribed) && (
                  <BsPatchCheckFill className="text-blue-500 size-4 flex-shrink-0" />
                )}
              </div>

              {!isAddUser && (
                <div className="flex-shrink-0 text-[11px] font-normal text-black opacity-50 whitespace-nowrap">
                  {/* Optional time */}
                  {timeOrText}
                </div>
              )}
            </div>

            {/* Last message or typing indicator */}
            <div className="flex justify-between items-center w-full">
              {!isAddUser && isTyping && onlineStatus ? (
                <div className="flex items-center gap-1 pl-1">
                  <span className="text-sm text-[#615EF0] animate-pulse">
                    Typing
                  </span>
                  <span className="animate-bounce text-[#615EF0]">.</span>
                  <span
                    className="animate-bounce text-[#615EF0]"
                    style={{ animationDelay: '100ms' }}
                  >
                    .
                  </span>
                  <span
                    className="animate-bounce text-[#615EF0]"
                    style={{ animationDelay: '200ms' }}
                  >
                    .
                  </span>
                </div>
              ) : (
                <>
                  <div className="pt-1 overflow-hidden w-[calc(100%-30px)]">
                    <MessagePreview
                      type={ContentType}
                      message={lastMessageOrUserName}
                    />
                  </div>
                  {unreadCount > 0 && (
                    <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums bg-[#C9C9C9]">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Button>
    </>
  );
}
