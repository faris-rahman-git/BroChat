import ChatList from '@client/components/customUi/user/panels/ChatList';
import { setChatListSize } from '@client/redux/features/chatListSizeSlice';
import { RootState } from '@client/redux/store';
import { useSelector } from 'react-redux';
import CustomResizablePanels from '../../customUi/commonElemets/CustomResizablePanels';
import WellCome from '@client/components/customUi/user/panels/WellCome';
import ChatPanel from '@client/components/customUi/user/panels/ChatPanel';
import { getSocket } from '@client/configs/socket';
import { useEffect, useState } from 'react';
import { MessageType, SearchResultType } from '@bro/shared';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { addNewMessage } from '@client/redux/features/newMessagesSlice';
import { emitWithQueue } from '@client/lib/socket/emitWithQueue';
import { useChatList } from '@client/hooks/home/useChatList';
import { setTypingStatus } from '@client/redux/features/activeReceiverSlice';

function Home() {
  const dispatch = useAppDispatch();
  const size = useSelector((state: RootState) => state.chatListSize.size);
  const activeChatId = useSelector(
    (state: RootState) => state.activeReceiver.conversationId
  );

  const [chatListData, setChatListData] = useState<SearchResultType[]>([]);
  const { isPending, isSuccess, isError, mutate, error, data } = useChatList();

  useEffect(() => {
    mutate();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setChatListData(data.usersList);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      console.log(error.message);
    }
  }, [isError]);

  useEffect(() => {
    if (isPending) {
      console.log('Loading...');
    }
  }, [isPending]);

  const handleResize = (newSize: number) => {
    dispatch(setChatListSize(newSize));
  };

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = async (
      data: MessageType,
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      dispatch(
        addNewMessage({
          conversationId: data.conversationId as string,
          message: data,
        })
      );
      try {
        await emitWithQueue({
          event: 'message-status-updated',
          data: {
            messageId: data._id,
            senderId: data.senderId,
            status: 'delivered',
          },
        });
      } catch (err) {
        console.error('Failed to emit status update:', err);
      }
    };

    socket.on('new-message', handleNewMessage);

    return () => {
      socket.off('new-message', handleNewMessage);
    };
  }, [activeChatId]);

  // Update user online status and typing status
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const updateUserOnlineStatus = (userId: string, status: boolean) => {
      setChatListData((prev) =>
        prev.map((user) =>
          user.receiverId === userId ? { ...user, isOnline: status } : user
        )
      );
    };

    socket.on('user-online', (userId, ack?: (status: boolean) => void) => {
      if (typeof ack === 'function') ack(true);
      updateUserOnlineStatus(userId, true);
    });
    socket.on('user-offline', (userId, ack?: (status: boolean) => void) => {
      if (typeof ack === 'function') ack(true);
      updateUserOnlineStatus(userId, false);
    });

    const handleTypingStatus = ({
      senderId,
      status,
    }: {
      senderId: string;
      status: boolean;
    },
    ack?: (status: boolean) => void) => {
      if (typeof ack === 'function') ack(true);
      setChatListData((prev) =>
        prev.map((user) =>
          user.receiverId === senderId ? { ...user, isTyping: status } : user
        )
      );
      dispatch(setTypingStatus({ status }));
    };

    socket.on('typing-status', handleTypingStatus);

    return () => {
      socket.off('user-online');
      socket.off('user-offline');
    };
  }, []);

  return (
    <CustomResizablePanels
      left={
        <ChatList
          chatListData={chatListData}
          setChatListData={setChatListData}
        />
      }
      right={activeChatId == '' ? <WellCome /> : <ChatPanel />}
      minSize={350}
      maxSize={600}
      onResize={handleResize}
      defaultSize={size}
    />
  );
}

export default Home;
