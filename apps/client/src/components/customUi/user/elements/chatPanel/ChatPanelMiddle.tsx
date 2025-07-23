import MessageBubble from './ChatPanelMiddle/MessageBubble';
import avatar from '@client/assets/defaultAvatar/avatar.webp';
import { useEffect, useRef, useState } from 'react';
import { LuLock } from 'react-icons/lu';
import { MessageType } from '@bro/shared';
import TypingBubble from './ChatPanelMiddle/TypingBubble';
import { RootState } from '@client/redux/store';
import { useSelector } from 'react-redux';
import { useFormattedTimestamp } from '@client/hooks/commonHooks/useFormattedTimestamp';
import { selectGroupChatById } from '@client/redux/selectors/groupChatSelectors';

function ChatPanelMiddle({
  messages,
  userId,
  isTyping,
  isGroup,
  conversationId,
}: {
  messages: MessageType[];
  userId: string;
  isTyping: boolean;
  isGroup: boolean;
  conversationId: string;
}) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  let lastDateLabel = '';
  const [typingShowAvatar, setTypingShowAvatar] = useState<boolean>(false);
  const browserIsOnline = useSelector(
    (state: RootState) => state.browserOnlineStatus.isOnline
  );
  const group = useSelector(selectGroupChatById(conversationId!));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' });
    const lastMessage = messages[messages.length - 1];
    const isFirstInGroup = !lastMessage || lastMessage.senderId == userId;

    setTypingShowAvatar(isFirstInGroup);
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
      <div className="flex flex-col gap-2.5 justify-end min-h-full">
        <div className="text-center flex justify-center items-center text-xs text-muted-foreground my-2">
          <div className="flex w-fit text-center bg-[#C9C9C9]    py-1 px-2 rounded-[6px]">
            <LuLock />
            <p className="ps-1">
              Messages and calls are end-to-end encrypted. Only people in this
              chat can read, listen to or share them.
            </p>
          </div>
        </div>
        {messages.map((message, index) => {
          const { displayTime, dateLabel } = useFormattedTimestamp(
            message.messageTime
          );

          const prevMessage = messages[index - 1];
          const isFirstInGroup =
            !prevMessage || prevMessage.senderId !== message.senderId;

          const showDate = dateLabel !== lastDateLabel;
          lastDateLabel = dateLabel;

          return (
            <div key={index}>
              {showDate && (
                <div className="text-center text-xs text-muted-foreground my-2">
                  {dateLabel}
                </div>
              )}
              <MessageBubble
                messageId={message._id as string}
                conversationId={message.conversationId as string}
                isMine={message.senderId === userId}
                message={message.content as string}
                time={displayTime}
                status={message.status}
                avatarUrl={message.senderAvatar as string}
                senderName={message.senderName as string}
                showAvatar={showDate ? true : isFirstInGroup}
                isEdited={message.isEdited}
                isGroup={isGroup}
                isAdmin={group?.Admins.includes(userId) ?? true}
                MessageType={message.MessageType}
                mediaUrl={message.mediaUrl}
              />
            </div>
          );
        })}
        {isTyping && browserIsOnline && (
          <TypingBubble avatarUrl={avatar} showAvatar={typingShowAvatar} />
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default ChatPanelMiddle;
