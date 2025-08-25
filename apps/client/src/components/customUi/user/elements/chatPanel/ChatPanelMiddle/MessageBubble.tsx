import { cn } from '@client/lib/utils';
import {
  LuCopy,
  LuForward,
  LuReply,
  LuSmile,
  LuTrash,
  LuTrash2,
} from 'react-icons/lu';
import {
  MdArrowDropDown,
  MdOutlineCheckBox,
  MdOutlineEdit,
} from 'react-icons/md';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@client/components/ui/avatar';
import {
  ContentType,
  MessageStatusType,
  ReactionsType,
  ReplyToType,
} from '@bro/shared';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@client/components/ui/context-menu';
import ConfirmActionButton from '@client/components/customUi/commonElemets/ConfirmActionButton';
import { setEditingMessage } from '@client/redux/features/userSlices/homeSlices/messageSlice/messageEditingSlice';
import ForwardModal from './ForwardModal';
import { Input } from '@client/components/ui/input';
import EmojiPicker from 'emoji-picker-react';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import React from 'react';
import ContextMenuComponent from './MessageBubble/ContextMenuComponent';
import { useMessageBubbleHook } from '@client/hooks/PageHooks/user/HomePage/Home/panels/ChatPanel/element/ChatPanelMiddle/useMessageBubbleHook';

type Props = {
  messageId: string;
  conversationId: string;
  isMine: boolean;
  message: string;
  time: string;
  status?: MessageStatusType;
  avatarUrl?: string;
  showAvatar?: boolean;
  senderId?: string;
  senderName?: string;
  isEdited?: boolean;
  isGroup?: boolean;
  MessageType?: ContentType;
  mediaUrl?: string | null;
  createdAt?: string | Date;
  isForward?: boolean;
  isSelecting?: boolean;
  isSelected?: boolean;
  onStartSelect?: () => void;
  onToggleSelect?: () => void;
  canDeleteForEveryone?: boolean;
  isActive?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
  reactions?: ReactionsType[];
  replyTo?: ReplyToType;
  onScrollToMessage?: (messageId: string) => void;
  onReply?: (data: ReplyToType) => void;
};

const MessageBubble = ({
  messageId,
  conversationId,
  isMine,
  message,
  time,
  status = 'sent',
  showAvatar = true,
  avatarUrl,
  senderId,
  senderName = '',
  isEdited,
  isGroup,
  MessageType,
  mediaUrl,
  createdAt = new Date(),
  isForward,
  isSelecting,
  isSelected,
  onStartSelect,
  onToggleSelect,
  canDeleteForEveryone = false,
  isActive,
  onHover,
  onLeave,
  reactions = [],
  replyTo,
  onScrollToMessage,
  onReply,
}: Props) => {
  const dispatch = useAppDispatch();

  const {
    handleDelete,
    handleCopy,
    handleEmojiButtonClick,
    handleEmojiSelect,
    getFloatingProps,
    floatingStyles,
    refs,
    handleReply,
    forwardModalOpen,
    setForwardModalOpen,
    menuKey,
    canEdit,
    isBeingEdited,
    userDetails,
    showEmojiPicker,
  } = useMessageBubbleHook(
    messageId,
    conversationId,
    message,
    createdAt,
    mediaUrl,
    MessageType,
    isMine,
    onReply,
    senderId,
    senderName
  );

  return (
    <div
      className={cn(
        'flex w-full gap-2 relative',
        isMine ? 'justify-end' : 'justify-start',
        isBeingEdited &&
          'ring-2 ring-[#615EF0] rounded-b-[6px] rounded-tl-[6px]',
        isSelecting && isSelected && 'bg-[#c9c9c94c] ',
        isSelecting && 'hover:bg-[#c9c9c920]'
      )}
      onClick={(e) => {
        if (!isSelecting) return;
        e.stopPropagation();
        onToggleSelect?.();
      }}
    >
      {!isMine && !isSelecting && (
        <div className="min-w-6 h-6">
          {showAvatar && (
            <Avatar className="size-6 self-end rounded-[6px] object-cover">
              <AvatarImage src={avatarUrl} alt="avatar" />
              <AvatarFallback className="text-center bg-white rounded-[6px]">
                {senderName.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      )}
      {isSelecting && (
        <div className={cn('flex items-center', isMine ? 'flex-1' : '')}>
          <Input
            type="checkbox"
            checked={isSelected}
            className="cursor-pointer size-4 ms-2"
            onChange={() => {}}
          />
        </div>
      )}

      <ContextMenu key={menuKey}>
        {isMine && isActive && !isSelecting && (
          <div
            className="flex items-center transition"
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            ref={refs.setReference}
          >
            <button
              className="p-1  bg-gray-200 flex rounded-[6px] px-1"
              onClick={handleEmojiButtonClick}
            >
              <MdArrowDropDown />
              <LuSmile />
            </button>
          </div>
        )}
        <ContextMenuTrigger
          className={cn(
            'relative max-w-[65%] min-w-[125px] rounded-[6px] px-4 pt-2 pb-5 text-sm whitespace-pre-wrap break-words group',
            isMine
              ? 'bg-[#615EF0] text-white rounded-tr-none'
              : 'bg-white text-black rounded-tl-none',
            reactions.length > 0 ? 'mb-5' : '',
            isEdited ? 'min-w-[125px]' : 'min-w-[100px]'
          )}
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
        >
          <ContextMenuComponent
            messageId={messageId}
            conversationId={conversationId}
            message={message}
            reactions={reactions}
            userDetails={userDetails}
            onScrollToMessage={onScrollToMessage}
            replyTo={replyTo}
            status={status}
            isMine={isMine}
            isGroup={isGroup}
            showAvatar={showAvatar}
            senderName={senderName}
            isForward={isForward}
            MessageType={MessageType || 'text'}
            mediaUrl={mediaUrl}
            isEdited={isEdited}
            time={time}
          />
        </ContextMenuTrigger>
        {!isMine && isActive && !isSelecting && (
          <div
            className="flex items-center transition delay-1000"
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            ref={refs.setReference}
          >
            <button
              className="p-1  bg-gray-200 flex rounded-[6px] px-1"
              onClick={handleEmojiButtonClick}
            >
              <LuSmile />
              <MdArrowDropDown />
            </button>
          </div>
        )}
        <ContextMenuContent className="w-52">
          <ContextMenuItem inset onClick={() => setForwardModalOpen(true)}>
            Forward
            <ContextMenuShortcut>
              <LuForward />
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem inset onClick={handleReply}>
            Reply
            <ContextMenuShortcut>
              <LuReply />
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem
            inset
            onClick={handleCopy}
            disabled={MessageType !== 'text' && MessageType !== 'image'}
          >
            Copy
            <ContextMenuShortcut>
              <LuCopy />
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger inset>Delete</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-auto">
              <ContextMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                <ConfirmActionButton
                  buttonClassName="transparent text-red-500 hover:text-red-500 w-full h-ful flex justify-start items-center"
                  buttonContent="Delete for me"
                  buttonIcon={LuTrash}
                  modalTitle={`Delete Message`}
                  modalDescription="This have no effect on your recipient chat."
                  confirmButtonContent="Delete for me"
                  onConfirm={() => handleDelete('me')}
                />
              </ContextMenuItem>
              {canDeleteForEveryone && (
                <ContextMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <ConfirmActionButton
                    buttonClassName="transparent text-red-500 hover:text-red-500 w-full h-ful flex justify-start items-center"
                    buttonContent="Delete for everyone"
                    buttonIcon={LuTrash2}
                    modalTitle={`Delete Message`}
                    modalDescription="This have no effect on your recipient chat."
                    confirmButtonContent="Delete For Everyone"
                    onConfirm={() => handleDelete('everyone')}
                  />
                </ContextMenuItem>
              )}
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuItem
            disabled={!isMine || !canEdit}
            inset
            onClick={() =>
              dispatch(
                setEditingMessage({
                  messageId,
                  conversationId,
                  message: message,
                })
              )
            }
          >
            Edit
            <ContextMenuShortcut>
              <MdOutlineEdit />
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem inset onClick={() => onStartSelect?.()}>
            Select
            <ContextMenuShortcut>
              <MdOutlineCheckBox />
            </ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <ForwardModal
        open={forwardModalOpen}
        onOpenChange={setForwardModalOpen}
        forwardData={[
          {
            message,
            MessageType: MessageType ?? 'text',
            mediaUrl,
            forwardLabel: isForward ? isForward : !isMine,
          },
        ]}
      />

      {showEmojiPicker && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="z-50 "
          {...getFloatingProps()}
        >
          <EmojiPicker
            onEmojiClick={handleEmojiSelect}
            width={300}
            height={350}
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(MessageBubble);
