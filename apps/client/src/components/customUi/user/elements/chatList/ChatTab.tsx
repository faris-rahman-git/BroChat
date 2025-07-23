import { Button } from '@client/components/ui/button';
import { ComponentProps } from 'react';
import ChatTabButton from './chatTab/ChatTabButton';
import { ContentType } from '@bro/shared';

type ChatTabProps = {
  isAddUser?: boolean;
  lastMessageOrUserName: string;
  ContentType?: ContentType;
  unreadCount?: number;
  onlineStatus?: boolean;
  isTyping?: boolean;
  avatar: string;
  chatName: string;
} & ComponentProps<typeof Button>;

function ChatTab({
  isAddUser = false,
  lastMessageOrUserName,
  ContentType ,
  unreadCount = 0,
  onlineStatus = false,
  className,
  isTyping = false,
  avatar,
  chatName,
  ...props
}: ChatTabProps) {
  return (
    <>
      <ChatTabButton
        avatar={avatar}
        chatName={chatName}
        lastMessageOrUserName={lastMessageOrUserName}
        ContentType={ContentType}
        unreadCount={unreadCount}
        isTyping={isTyping}
        onlineStatus={onlineStatus}
        isAddUser={isAddUser}
        className={className}
        {...props}
      />
    </>
  );
}

export default ChatTab;
