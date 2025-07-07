import ChatPanelTop from '../elements/chatPanel/ChatPanelTop';
import ChatPanelMiddle from '../elements/chatPanel/ChatPanelMiddle';
import ChatPanelBottom from '../elements/chatPanel/ChatPanelBottom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@client/redux/store';
import { getSocket } from '@client/configs/socket';
import { usePrevMessages } from '@client/hooks/home/usePrevMessages';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { hideLoader, showLoader } from '@client/redux/features/LoaderSlice';
import { useCreateNewConversation } from '@client/hooks/home/useCreateNewConversation';
import { setActiveReceiverConversationId } from '@client/redux/features/activeReceiverSlice';
import { MessageStatusType, MessageType } from '@bro/shared';
import { v4 as uuidv4 } from 'uuid';
import { removeOneConversation } from '@client/redux/features/newMessagesSlice';
import { selectNewMessagesByConversation } from '@client/redux/selectors/newMessageSelectors';
import { emitWithQueue } from '@client/lib/socket/emitWithQueue';

function ChatPanel() {
  const receiverDetails = useSelector(
    (state: RootState) => state.activeReceiver
  );
  const activeChatId = receiverDetails.conversationId || '';
  const newMessages = useSelector(
    selectNewMessagesByConversation(activeChatId)
  );
  const [messages, setMessages] = useState<MessageType[]>([]);
  const userId = useSelector((state: RootState) => state.user.id);
  const activeSectionTab = useSelector(
    (state: RootState) => state.activeSectionTab.value
  );
  const browserIsOnline = useSelector(
    (state: RootState) => state.browserOnlineStatus.isOnline
  );
  const dispatch = useAppDispatch();
  const { isPending, isError, isSuccess, mutate, data, error } =
    usePrevMessages();

  useEffect(() => {
    if (activeChatId != '' && activeChatId) {
      mutate(activeChatId as string);
    } else {
      setMessages([]);
    }
  }, [activeChatId]);

  useEffect(() => {
    if (isSuccess) {
      setMessages(data.messages);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      console.log('Error: ', error);
    }
  }, [isError]);

  useEffect(() => {
    if (isPending) {
      dispatch(showLoader());
    } else {
      dispatch(hideLoader());
    }
  }, [isPending]);

  useEffect(() => {
    if (newMessages.length > 0) {
      setMessages((prev) => [...prev, ...newMessages]);
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

  const { mutate: createNewConversationMutate } = useCreateNewConversation();

  const sendMessageToSocket = async (newMessage: MessageType) => {
    const socket = getSocket();
    if (!socket) return;
    try {
      await emitWithQueue({ event: 'send-message', data: newMessage });
    } catch (err) {
      console.error('Failed to emit status update:', err);
    }

    socket.on(
      'message-status-sent',
      (
        data: { tempId: string; savedMessage: MessageType },
        ack?: (status: boolean) => void
      ) => {
        if (typeof ack === 'function') ack(true);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.tempId === data.tempId ? data.savedMessage : msg
          )
        );
      }
    );
  };

  const handleSendMessage = (content: string) => {
    const tempId = uuidv4();

    const newMessage: MessageType = {
      tempId,
      conversationId: activeChatId,
      senderId: userId as string,
      MessageType: 'text',
      content,
      status: 'sending',
      messageTime: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);

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
      const { messageId, status } = data;
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? { ...msg, status } : msg))
      );
    };

    socket.on('message-status-update', handleMessageStatusUpdate);

    return () => {
      socket.off('message-status-update', handleMessageStatusUpdate);
    };
  }, [activeChatId]);

  return (
    <div className="bg-[#f3f3f3] h-screen flex flex-col">
      <ChatPanelTop
        avatar={receiverDetails.avatar as string}
        name={receiverDetails.name as string}
        isOnline={browserIsOnline && (receiverDetails.isOnline as boolean)}
        isTyping={browserIsOnline && (receiverDetails.isTyping as boolean)}
      />

      <ChatPanelMiddle
        messages={messages}
        userId={userId as string}
        isTyping={receiverDetails.isTyping as boolean}
      />

      <ChatPanelBottom
        onSend={handleSendMessage}
        receiverId={receiverDetails.receiverId as string}
      />
    </div>
  );
}

export default ChatPanel;
