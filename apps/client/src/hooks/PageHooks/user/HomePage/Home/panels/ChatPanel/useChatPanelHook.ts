import { selectNewMessagesByConversation } from '@client/redux/selectors/newMessageSelectors';
import { selectMessagesByConversation } from '@client/redux/selectors/selectMessagesByConversation';
import { RootState } from '@client/redux/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  ContentType,
  MessageStatusType,
  MessageType,
  ReplyToType,
} from '@bro/shared';
import { usePrevMessagesForm } from '@client/hooks/home/messageHooks/logic/usePrevMessagesForm';
import {
  appendMessage,
  updateMessageStatus,
} from '@client/redux/features/userSlices/homeSlices/messageSlice/messageHistorySlice';
import { removeOneConversation } from '@client/redux/features/userSlices/homeSlices/messageSlice/newMessagesSlice';
import { getSocket } from '@client/configs/socket';
import { emitWithQueue } from '@client/lib/socket/emitWithQueue';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { useCreateNewConversation } from '@client/hooks/home/dmHooks/api/useCreateNewConversation';
import { v4 as uuidv4 } from 'uuid';
import { setActiveReceiverConversationId } from '@client/redux/features/userSlices/homeSlices/commonSlices/activeReceiverSlice';
import { changeChatToTop } from '@client/redux/features/userSlices/homeSlices/dmSlices/oneToOneChatSlice';
import { changeGroupChatToTop } from '@client/redux/features/userSlices/homeSlices/groupSlice/groupChatSlice';

export const useChatPanelHook = () => {
  const receiverDetails = useSelector(
    (state: RootState) => state.activeReceiver
  );
  const activeChatId = receiverDetails?.conversationId || '';

  const newMessages = useSelector(
    selectNewMessagesByConversation(activeChatId)
  );
  const messages = useSelector((state: RootState) =>
    selectMessagesByConversation(state, activeChatId)
  );
  const userDetails = useSelector((state: RootState) => state.user);
  const activeSectionTab = useSelector(
    (state: RootState) => state.activeSectionTab.value
  );
  const browserIsOnline = useSelector(
    (state: RootState) => state.browserOnlineStatus.isOnline
  );

  const [showExclusiveModal, setShowExclusiveModal] = useState(false);
  const [onReplyData, setOnReplyData] = useState<ReplyToType | null>(null);
  const [fetchedIds, setFetchedIds] = useState<Set<string>>(new Set());

  const dispatch = useAppDispatch();

  const { prevMutate } = usePrevMessagesForm(activeChatId);
  const { mutate: createNewConversationMutate } = useCreateNewConversation();

  useEffect(() => {
    if (!activeChatId || activeChatId === '') return;

    if (!activeChatId.startsWith('temp-') && !fetchedIds.has(activeChatId)) {
      prevMutate(activeChatId);
      setFetchedIds((prev) => new Set(prev).add(activeChatId));
    }
  }, [activeChatId]);

  useEffect(() => {
    if (newMessages.length > 0) {
      newMessages.forEach((msg) => {
        dispatch(appendMessage({ conversationId: activeChatId, message: msg }));
      });
      dispatch(removeOneConversation(activeChatId));

      // Update message status to seen
      const socket = getSocket();
      if (!socket) return;
      newMessages.map((msg) => {
        try {
          emitWithQueue({
            event: 'message-status-updated',
            data: {
              messageId: msg._id,
              senderId: msg.senderId,
              status: 'seen',
            },
          });
        } catch (err) {
          console.error('Failed to emit status update:', err);
        }
      });
    }
  }, [newMessages, activeChatId]);

  const sendMessageToSocket = async (newMessage: MessageType) => {
    const socket = getSocket();
    if (!socket) return;
    try {
      await emitWithQueue({ event: 'send-message', data: newMessage });
    } catch (err) {
      console.error('Failed to emit status update:', err);
    }
  };

  const handleSendMessage = ({
    content,
    mediaUrl,
    MessageType,
  }: {
    content?: string;
    mediaUrl?: string;
    MessageType: ContentType;
  }) => {
    handleCancelReply();

    const tempId = uuidv4();
    const newMessage: MessageType = {
      tempId,
      conversationId: activeChatId,
      senderId: userDetails.id as string,
      MessageType: MessageType,
      content,
      mediaUrl,
      status: 'sending',
      messageTime: new Date().toISOString(),
      replyTo: onReplyData ?? undefined,
    };

    const tempConversationId = `temp-${tempId}`;
    if (!activeChatId || activeChatId === '') {
      dispatch(setActiveReceiverConversationId(tempConversationId));
    }
    dispatch(
      appendMessage({
        conversationId:
          activeChatId != '' && activeChatId
            ? activeChatId
            : tempConversationId,
        message: newMessage,
      })
    );

    // If there is no active chat, create a new conversation
    if ((activeChatId === '' || !activeChatId) && activeSectionTab === 'DMs') {
      const receiverId: string = receiverDetails.receiverId as string;
      createNewConversationMutate(receiverId, {
        onSuccess: (data) => {
          const conversationId = data.newConversationId;
          dispatch(setActiveReceiverConversationId(conversationId));
          sendMessageToSocket({ ...newMessage, conversationId });
        },
      });
    } else {
      dispatch(
        changeChatToTop({
          conversationId: activeChatId,
        })
      );
      dispatch(
        changeGroupChatToTop({
          conversationId: activeChatId,
        })
      );
      sendMessageToSocket(newMessage);
    }
  };

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleMessageStatusUpdate = (
      data: {
        messageId: string;
        status: MessageStatusType;
      },
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      dispatch(
        updateMessageStatus({
          conversationId: activeChatId,
          messageId: data.messageId,
          status: data.status,
        })
      );
    };

    socket.on('message-status-update', handleMessageStatusUpdate);

    return () => {
      socket.off('message-status-update', handleMessageStatusUpdate);
    };
  }, [activeChatId]);

  const handleReply = (data: ReplyToType) => {
    setOnReplyData(data);
  };

  const handleCancelReply = () => {
    setOnReplyData(null);
  };

  return {
    handleSendMessage,
    handleReply,
    handleCancelReply,
    showExclusiveModal,
    setShowExclusiveModal,
    messages,
    browserIsOnline,
    receiverDetails,
    activeChatId,
    activeSectionTab,
    userDetails,
    onReplyData
  };
};
