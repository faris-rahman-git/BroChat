import { useDeleteMessageForm } from '@client/hooks/home/messageHooks/logic/useDeleteMessageForm';
import { deleteMessage } from '@client/redux/features/userSlices/homeSlices/messageSlice/messageHistorySlice';
import { useState } from 'react';
import {
  ContentType,
  DeleteMessageType,
  getMinutesSince,
  ReplyToType,
} from '@bro/shared';
import { useSelector } from 'react-redux';
import { RootState } from '@client/redux/store';
import {
  useFloating,
  flip,
  shift,
  offset,
  useDismiss,
  useInteractions,
} from '@floating-ui/react';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { useAddReactionForm } from '@client/hooks/home/messageHooks/logic/useAddReactionForm';

export const useMessageBubbleHook = (
  messageId: string,
  conversationId: string,
  message: string,
  createdAt: string | Date,
  mediaUrl?: string | null,
  MessageType?: ContentType,
  isMine?: boolean,
  onReply?: (data: ReplyToType) => void,
  senderId?: string,
  senderName?: string
) => {
  const [menuKey, setMenuKey] = useState(0);
  const [forwardModalOpen, setForwardModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const editingMessage = useSelector(
    (state: RootState) => state.editingMessage
  );
  const userDetails = useSelector((state: RootState) => state.user);
  const canEdit = userDetails.isSubscribed || getMinutesSince(createdAt) <= 5;

  const successHandler = () => {
    dispatch(deleteMessage({ conversationId, messageId }));
  };

  const { mutate } = useDeleteMessageForm(successHandler);

  const isBeingEdited = editingMessage?.messageId === messageId;

  const handleDelete = (type: DeleteMessageType) => {
    mutate({ messageIds: [messageId], conversationId, type });
    setMenuKey((prev) => prev + 1);
  };

  //handle copy
  const handleCopy = async () => {
    if (MessageType === 'text') {
      navigator.clipboard.writeText(message);
    }
    if (MessageType === 'image') {
      const response = await fetch(mediaUrl as string);
      const blob = await response.blob();

      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
    }
  };

  //reaction
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { addReactionMutate } = useAddReactionForm(conversationId, messageId);

  const handleEmojiButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiSelect = (emojiData: any) => {
    addReactionMutate({ messageId, emoji: emojiData.emoji, conversationId });
    setShowEmojiPicker(false);
  };

  const { refs, floatingStyles, context } = useFloating({
    open: showEmojiPicker,
    onOpenChange: setShowEmojiPicker,
    placement: isMine ? 'left' : 'right',
    middleware: [offset(6), flip(), shift()],
  });

  const dismiss = useDismiss(context);
  const { getFloatingProps } = useInteractions([dismiss]);

  const handleReply = () => {
    onReply?.({
      _id: messageId,
      senderId,
      senderName: senderName || 'Unknown',
      MessageType: MessageType || 'text',
      content: message,
      mediaUrl: mediaUrl || undefined,
    });
  };

  return {
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
  };
};
