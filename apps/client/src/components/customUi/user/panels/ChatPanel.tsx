import ChatPanelTop from '../elements/chatPanel/ChatPanelTop';
import ChatPanelMiddle from '../elements/chatPanel/ChatPanelMiddle';
import ChatPanelBottom from '../elements/chatPanel/ChatPanelBottom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@client/redux/store';
import { getSocket } from '@client/configs/socket';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { setActiveReceiverConversationId } from '@client/redux/features/userSlices/homeSlices/commonSlices/activeReceiverSlice';
import { ContentType, MessageStatusType, MessageType } from '@bro/shared';
import { v4 as uuidv4 } from 'uuid';
import { removeOneConversation } from '@client/redux/features/userSlices/homeSlices/messageSlice/newMessagesSlice';
import { selectNewMessagesByConversation } from '@client/redux/selectors/newMessageSelectors';
import { emitWithQueue } from '@client/lib/socket/emitWithQueue';
import { usePrevMessages } from '@client/hooks/home/messageHooks/usePrevMessages';
import { useCreateNewConversation } from '@client/hooks/home/dmHooks/useCreateNewConversation';
import {
  appendMessage,
  replaceMessageByTempId,
  setMessagesForConversation,
  updateMessageStatus,
} from '@client/redux/features/userSlices/homeSlices/messageSlice/messageHistorySlice';
import { selectMessagesByConversation } from '@client/redux/selectors/selectMessagesByConversation';
import { changeChatToTop } from '@client/redux/features/userSlices/homeSlices/dmSlices/oneToOneChatSlice';
import { changeGroupChatToTop } from '@client/redux/features/userSlices/homeSlices/groupSlice/groupChatSlice';

function ChatPanel() {
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
  const userId = useSelector((state: RootState) => state.user.id);
  const activeSectionTab = useSelector(
    (state: RootState) => state.activeSectionTab.value
  );
  const browserIsOnline = useSelector(
    (state: RootState) => state.browserOnlineStatus.isOnline
  );
  const dispatch = useAppDispatch();
  const {
    isPending: prevIsPending,
    isError: prevIsError,
    isSuccess: prevIsSuccess,
    mutate: prevMutate,
    data: prevData,
    error: prevError,
  } = usePrevMessages();

  const [fetchedIds, setFetchedIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (!activeChatId || activeChatId === '') return;

    if (!activeChatId.startsWith('temp-') && !fetchedIds.has(activeChatId)) {
      prevMutate(activeChatId);
      setFetchedIds((prev) => new Set(prev).add(activeChatId));
    }
  }, [activeChatId]);
  useEffect(() => {
    if (prevIsSuccess) {
      dispatch(
        setMessagesForConversation({
          conversationId: activeChatId,
          messages: prevData.messages,
        })
      );
    }
  }, [prevIsSuccess]);
  useEffect(() => {
    if (prevIsError) {
      console.log('Error: ', prevError);
    }
  }, [prevIsError]);
  useEffect(() => {
    dispatch(prevIsPending ? showLoader() : hideLoader());
  }, [prevIsPending]);
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
        dispatch(
          replaceMessageByTempId({
            conversationId: data.savedMessage.conversationId as string,
            tempId: data.tempId,
            savedMessage: data.savedMessage,
          })
        );
      }
    );
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
    const tempId = uuidv4();

    const newMessage: MessageType = {
      tempId,
      conversationId: activeChatId,
      senderId: userId as string,
      MessageType: MessageType,
      content,
      mediaUrl,
      status: 'sending',
      messageTime: new Date().toISOString(),
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

  return (
    <div className="bg-[#f3f3f3] h-screen flex flex-col">
      <ChatPanelTop
        avatar={receiverDetails.avatar as string}
        name={receiverDetails.name as string}
        isOnline={browserIsOnline && (receiverDetails.isOnline as boolean)}
        isTyping={browserIsOnline && (receiverDetails.isTyping as boolean)}
        isGroup={receiverDetails.isGroup ? true : false}
      />

      <ChatPanelMiddle
        messages={messages}
        userId={userId as string}
        isTyping={receiverDetails.isTyping as boolean}
        isGroup={receiverDetails.isGroup ? true : false}
        conversationId={activeChatId}
      />

      {receiverDetails.isBlockedByMe ||
      receiverDetails.hasBlockedMe ||
      receiverDetails.isBlocked ? null : (
        <ChatPanelBottom
          onSend={handleSendMessage}
          receiverId={receiverDetails.receiverId as string}
        />
      )}
    </div>
  );
}

export default ChatPanel;
