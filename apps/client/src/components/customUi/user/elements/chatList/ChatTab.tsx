import { Button } from '@client/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import MessagePreview from './chatTab/MessagePreview';
import { ComponentProps } from 'react';
import { cn } from '@client/lib/utils';
import { SearchResultType } from '@bro/shared';
import { Badge } from '@client/components/ui/badge';

type ChatTabProps = {
  receiverTab: SearchResultType;
  isAddUser: boolean;
  lastMessage?: string;
  unreadCount?: number;
  onlineStatus?: boolean;
  isTyping?: boolean;
} & ComponentProps<typeof Button>;

function ChatTab({
  receiverTab,
  isAddUser,
  lastMessage,
  unreadCount = 0,
  onlineStatus = false,
  className,
  isTyping = false,
  ...props
}: ChatTabProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        'gap-4 p-3 flex items-start self-stretch w-full h-auto justify-start hover:cursor-pointer',
        className
      )}
      {...props}
    >
      {/* avatar */}
      <div className="relative size-[45px] flex-shrink-0   rounded-[6px] overflow-hidden">
        <Avatar className="size-full flex justify-center items-center bg-[#c9c9c9]">
          <AvatarImage
            src={receiverTab.avatar}
            alt={receiverTab.name}
            className="object-cover"
          />
          <AvatarFallback className="text-center ">
            {receiverTab.name.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        {onlineStatus && (
          <div className="absolute w-[15px] h-[15px] bottom-[-1.5px] right-[-1.5px] bg-red-700 rounded-full border-2 border-white" />
        )}
      </div>

      <div className="size-full flex flex-col items-start justify-center gap-2 flex-1 text-left overflow-hidden">
        <div className="flex w-full flex-col items-start justify-center">
          {/* name and time */}
          <div className="flex items-center justify-between w-full gap-2 ">
            <div className="flex-1 truncate font-semibold text-black text-sm">
              {receiverTab.name}
            </div>
            {!isAddUser && (
              <div className="flex-shrink-0 text-[11px] font-normal text-black opacity-50 whitespace-nowrap">
                {/* {receiverTab.time} */}
              </div>
            )}
          </div>

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
                    type="text"
                    message={isAddUser ? receiverTab.username : lastMessage}
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
  );
}

export default ChatTab;
