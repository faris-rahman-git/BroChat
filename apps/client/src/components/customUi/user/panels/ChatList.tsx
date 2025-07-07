import { Card } from '@client/components/ui/card';
import Header from '../elements/chatList/Header';
import ChatSearch from '../elements/chatList/ChatSearch';
import ChatTab from '../elements/chatList/ChatTab';
import React, { useEffect } from 'react';
import { getSocket } from '@client/configs/socket';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { setActiveReceiver } from '@client/redux/features/activeReceiverSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@client/redux/store';
import { SearchResultType } from '@bro/shared';

function ChatList({
  chatListData,
  setChatListData,
}: {
  chatListData: SearchResultType[];
  setChatListData: React.Dispatch<React.SetStateAction<SearchResultType[]>>;
}) {
  const dispatch = useAppDispatch();
  const activeReceiver = useSelector(
    (state: RootState) => state.activeReceiver
  );
  const newMessages = useSelector(
    (state: RootState) => state.newMessages.messagesByConversation
  );
  const browserIsOnline = useSelector(
    (state: RootState) => state.browserOnlineStatus.isOnline
  );

  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      console.log('No socket instance');
      return;
    }

    const handleNewUserChat = (
      data: SearchResultType,
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);

      setChatListData((prev) => {
        const alreadyExists = prev.some(
          (user) => user.receiverId === data.receiverId
        );
        if (alreadyExists) return prev;
        return [...prev, data];
      });
    };

    socket.on('new-user-chat', handleNewUserChat);

    return () => {
      socket.off('new-user-chat', handleNewUserChat);
    };
  }, []);

  useEffect(() => {
    if (activeReceiver.conversationId) {
      setChatListData((prev) => {
        const alreadyExists = prev.some(
          (chat) => chat.conversationId === activeReceiver.conversationId
        );
        if (!alreadyExists) {
          return [...prev, activeReceiver as SearchResultType];
        }
        return prev;
      });
    }
  }, [activeReceiver]);

  const handleUserClick = (receiverAndChatDetails: SearchResultType) => {
    dispatch(setActiveReceiver({ receiver: receiverAndChatDetails }));
  };

  return (
    <div className=" h-screen w-full select-none">
      <Card className="flex flex-col w-full h-screen gap-1 items-center bg-white shadow-[1px_0px_0px_#00000014] p-0 rounded-none">
        <Header />

        <div className="flex flex-col items-start w-full flex-1 min-h-0">
          <ChatSearch />

          <div className="flex flex-col gap-2 custom-scrollbar px-4 py-0 w-full overflow-y-auto flex-1 min-h-0 overflow-x-hidden!">
            {chatListData.map((receiverTab: SearchResultType, index) => (
              <ChatTab
                key={index}
                receiverTab={receiverTab}
                isAddUser={false}
                onClick={() => handleUserClick(receiverTab)}
                lastMessage={
                  newMessages[receiverTab.conversationId as string]?.[
                    newMessages[receiverTab.conversationId as string].length - 1
                  ].content ?? ''
                }
                onlineStatus={browserIsOnline && receiverTab.isOnline}
                isTyping={browserIsOnline && receiverTab.isTyping}
                unreadCount={
                  newMessages[receiverTab.conversationId as string]?.length
                }
                className={
                  activeReceiver?.conversationId === receiverTab.conversationId
                    ? 'bg-[#f3f3f3]'
                    : ''
                }
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default React.memo(ChatList);
