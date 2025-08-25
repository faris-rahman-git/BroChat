import { selectGroupChatById } from '@client/redux/selectors/groupChatSelectors';
import { RootState } from '@client/redux/store';
import { UserReduxType } from '@client/types/ReduxTypes';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { DeleteMessageType, MessageType } from '@bro/shared';
import { SelectedMessageData } from '@client/types/user/SelectedMessageDataType';
import { deleteMessage } from '@client/redux/features/userSlices/homeSlices/messageSlice/messageHistorySlice';
import { useScrollToMessage } from '@client/hooks/commonHooks/useScrollToMessage';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { useDeleteMessageForm } from '@client/hooks/home/messageHooks/logic/useDeleteMessageForm';

export const useChatPanelMiddleHook = (
  messages: MessageType[],
  userDetails: UserReduxType,
  conversationId: string
) => {
  const dispatch = useAppDispatch();
  const scrollToMessage = useScrollToMessage();

  const browserIsOnline = useSelector(
    (state: RootState) => state.browserOnlineStatus.isOnline
  );
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const group = useSelector(selectGroupChatById(conversationId!));
  const [forwardModalOpen, setForwardModalOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allCanDeleteForEveryone, setAllCanDeleteForEveryone] = useState(false);
  const [deleteType, setDeleteType] = useState<DeleteMessageType>('me');
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<
    SelectedMessageData[]
  >([]);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  const successHandler = () => {
    clearSelection();
    selectedMessages.forEach((msg) => {
      dispatch(deleteMessage({ conversationId, messageId: msg._id }));
    });
  };

  const { mutate } = useDeleteMessageForm(successHandler);

  const startSelection = (msg: SelectedMessageData) => {
    setIsSelecting(true);
    setSelectedMessages([msg]);
  };

  const toggleMessageSelection = (msg: SelectedMessageData) => {
    setSelectedMessages((prev) => {
      const exists = prev.some((m) => m._id === msg._id);
      return exists ? prev.filter((m) => m._id !== msg._id) : [...prev, msg];
    });
  };

  const clearSelection = () => {
    setIsSelecting(false);
    setSelectedMessages([]);
  };

  useEffect(() => {
    if (!openDeleteModal) {
      setDeleteType('me');
    }
  }, [openDeleteModal]);

  useEffect(() => {
    const allCanDeleteForEveryone = selectedMessages.every(
      (msg) => msg.canDeleteForEveryone
    );
    setAllCanDeleteForEveryone(allCanDeleteForEveryone);
  }, [selectedMessages]);
  const handleDelete = (deleteType: DeleteMessageType) => {
    const messageIds = selectedMessages.map((m) => m._id);
    mutate({ messageIds, conversationId, type: deleteType });
  };

  // reaction
  const handleMouseEnter = (id: string) => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
    setActiveMessageId(id);
  };
  const handleMouseLeave = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => {
      setActiveMessageId(null);
    }, 200);
  };
  const handleScrollToMessage = (messageId: string) => {
    scrollToMessage(messageId);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const threshold = 50;
    const atBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight < threshold;

    setIsAtBottom(atBottom);
    if (atBottom) {
      setUnreadCount(0);
    }
  };

  const [unreadCount, setUnreadCount] = useState(0);
  const prevMessageLength = useRef(0);

  useEffect(() => {
    // On first load → scroll to bottom
    if (prevMessageLength.current === 0 && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'instant' });
    }

    const newMessages = messages.slice(prevMessageLength.current);
    const lastMessage = messages[messages.length - 1];

    // If *I* sent the message → scroll to bottom
    if (lastMessage?.senderId === userDetails.id) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setUnreadCount(0);
    }
    // If the other person sent new messages and I’m not at bottom → increase unread count
    else if (newMessages.length > 0 && !isAtBottom) {
      setUnreadCount((c) => c + newMessages.length);
    }

    prevMessageLength.current = messages.length;
  }, [messages]);

  return {
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
  setUnreadCount
  };
};
