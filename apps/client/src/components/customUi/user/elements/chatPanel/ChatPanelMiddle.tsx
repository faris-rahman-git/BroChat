import MessageBubble from './ChatPanelMiddle/MessageBubble';
import avatar from '@client/assets/defaultAvatar/avatar.webp';
import { LuForward, LuLock } from 'react-icons/lu';
import {
  ContentType,
  DeleteMessageType,
  getMinutesSince,
  MessageType,
  ReplyToType,
} from '@bro/shared';
import TypingBubble from './ChatPanelMiddle/TypingBubble';
import { useFormattedTimestamp } from '@client/hooks/commonHooks/useFormattedTimestamp';
import { Button } from '@client/components/ui/button';
import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import { MdArrowDownward, MdDeleteOutline } from 'react-icons/md';
import { Input } from '@client/components/ui/input';
import ForwardModal from './ChatPanelMiddle/ForwardModal';
import { UserReduxType } from '@client/types/ReduxTypes';
import CustomModals from '@client/components/customUi/commonElemets/CustomModals';
import { Label } from '@client/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@client/components/ui/radio-group';
import { SelectedMessageData } from '@client/types/user/SelectedMessageDataType';
import { useChatPanelMiddleHook } from '@client/hooks/PageHooks/user/HomePage/Home/panels/ChatPanel/element/useChatPanelMiddleHook';

function ChatPanelMiddle({
  messages,
  userDetails,
  isTyping,
  isGroup,
  conversationId,
  onReply,
  onReplyData,
}: {
  messages: MessageType[];
  userDetails: UserReduxType;
  isTyping: boolean;
  isGroup: boolean;
  conversationId: string;
  onReply?: (data: ReplyToType) => void;
  onReplyData: ReplyToType | null;
}) {
  let lastDateLabel = '';

  const {
    bottomRef,
    group,
    forwardModalOpen,
    setForwardModalOpen,
    openDeleteModal,
    setOpenDeleteModal,
    allCanDeleteForEveryone,
    deleteType,
    setDeleteType,
    isSelecting,
    startSelection,
    toggleMessageSelection,
    clearSelection,
    handleDelete,
    handleMouseEnter,
    handleMouseLeave,
    handleScrollToMessage,
    browserIsOnline,
    activeMessageId,
    selectedMessages,
    setSelectedMessages,
    isAtBottom,
    handleScroll,
    unreadCount,
    setUnreadCount,
  } = useChatPanelMiddleHook(messages, userDetails, conversationId);

  return (
    <>
      {isSelecting && (
        <div className="sticky top-0 left-0 right-0 z-50 w-[100%] h-[60px] flex items-center justify-between px-4 py-2 bg-white text-black shadow-md">
          <div className="flex gap-4 items-center">
            <Input
              type="checkbox"
              className="w-4 h-4"
              checked={
                messages.length > 0 &&
                selectedMessages.length === messages.length
              }
              onChange={(e) => {
                if (e.target.checked) {
                  // select all
                  setSelectedMessages(
                    messages.map((m) => {
                      const isMineMsg = m.senderId === userDetails.id;

                      const isAdmin =
                        group?.Admins.includes(userDetails.id as string) ??
                        false;

                      const canDeleteForEveryone =
                        (userDetails.isSubscribed ||
                          getMinutesSince(m.createdAt ?? new Date()) <= 60) &&
                        (isMineMsg || isAdmin);

                      return {
                        _id: m._id as string,
                        message: m.content as string,
                        mediaUrl: m.mediaUrl,
                        forwardLabel: m.isForward as boolean,
                        MessageType: m.MessageType,
                        canDeleteForEveryone,
                      };
                    })
                  );
                } else {
                  // unselect all
                  setSelectedMessages([]);
                }
              }}
            />

            <span className="font-medium">
              {selectedMessages.length} selected
            </span>
          </div>

          <div className="flex items-center gap-4">
            <ButtonIcon
              onClick={() => {
                setForwardModalOpen(true);
              }}
              Icon={LuForward}
              label="Forward"
              iconClassName="size-6"
            />

            <ButtonIcon
              onClick={() => setOpenDeleteModal(true)}
              Icon={MdDeleteOutline}
              label="MdDeleteOutline"
              iconClassName="size-6"
            />

            <Button onClick={clearSelection}>Cancel</Button>
          </div>
        </div>
      )}

      <div
        className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8"
        onScroll={handleScroll}
      >
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

            const isMineMsg = message.senderId === userDetails.id;

            const isAdmin =
              group?.Admins.includes(userDetails.id as string) ?? true;

            const canDeleteForEveryone =
              (userDetails.isSubscribed ||
                getMinutesSince(message.createdAt ?? new Date()) <= 60) &&
              (isMineMsg || isAdmin);

            const payload: SelectedMessageData = {
              _id: message._id as string,
              MessageType: (message.MessageType as ContentType) ?? 'text',
              message: (message.content as string) ?? '',
              mediaUrl: message.mediaUrl,
              forwardLabel: !isMineMsg,
              canDeleteForEveryone,
            };

            return (
              <div key={index} data-message-id={message._id as string}>
                {showDate && (
                  <div className="text-center text-xs text-muted-foreground my-2">
                    {dateLabel}
                  </div>
                )}
                <MessageBubble
                  messageId={message._id as string}
                  conversationId={message.conversationId as string}
                  isMine={isMineMsg}
                  message={message.content as string}
                  time={displayTime}
                  status={message.status}
                  avatarUrl={message.senderAvatar as string}
                  senderId={message.senderId as string}
                  senderName={message.senderName as string}
                  showAvatar={showDate ? true : isFirstInGroup}
                  isEdited={message.isEdited}
                  isGroup={isGroup}
                  MessageType={message.MessageType}
                  mediaUrl={message.mediaUrl}
                  createdAt={message.createdAt}
                  isForward={message.isForward}
                  isSelecting={isSelecting}
                  isSelected={selectedMessages.some(
                    (m) => m._id === (message._id as string)
                  )}
                  onStartSelect={() => startSelection(payload)}
                  onToggleSelect={() => toggleMessageSelection(payload)}
                  canDeleteForEveryone={canDeleteForEveryone}
                  isActive={activeMessageId === message._id}
                  onHover={() => handleMouseEnter(message._id as string)}
                  onLeave={handleMouseLeave}
                  reactions={message.reactions ?? []}
                  replyTo={message.replyTo}
                  onScrollToMessage={handleScrollToMessage}
                  onReply={onReply}
                />
              </div>
            );
          })}
          {isTyping && browserIsOnline && <TypingBubble avatarUrl={avatar} />}

          {!isAtBottom && (
            <div
              className={`absolute  right-6 ${
                onReplyData ? 'bottom-45' : 'bottom-20'
              }`}
            >
              <Button
                onClick={() => {
                  bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
                  setUnreadCount(0);
                }}
                variant="default"
                size="icon"
                className="relative w-12 h-12 rounded-[6px] bg-app-primary shadow-lg hover:bg-app-primary/90 transition-colors flex items-center justify-center"
              >
                <MdArrowDownward className="size-7 text-black" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <ForwardModal
        open={forwardModalOpen}
        onOpenChange={setForwardModalOpen}
        forwardData={selectedMessages.map((m) => {
          return {
            MessageType: m.MessageType,
            message: m.message,
            mediaUrl: m.mediaUrl,
            forwardLabel: m.forwardLabel,
          };
        })}
        clearSelection={clearSelection}
      />

      <CustomModals
        open={openDeleteModal}
        onOpenChange={setOpenDeleteModal}
        title="Delete Messages"
        description="Choose how you want to delete the selected messages."
        confirmText="Delete"
        onConfirm={() => handleDelete(deleteType)}
      >
        <div className="space-y-4 pt-2">
          <RadioGroup
            value={deleteType}
            onValueChange={(value) => setDeleteType(value as DeleteMessageType)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="me" id="delete-me" />
              <Label htmlFor="delete-me">Delete for me</Label>
            </div>

            {allCanDeleteForEveryone && (
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="everyone" id="delete-everyone" />
                <Label htmlFor="delete-everyone">Delete for everyone</Label>
              </div>
            )}
          </RadioGroup>
        </div>
      </CustomModals>
    </>
  );
}

export default ChatPanelMiddle;
