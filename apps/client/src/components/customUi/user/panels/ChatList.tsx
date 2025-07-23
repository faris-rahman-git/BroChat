import { Card } from '@client/components/ui/card';
import Header from '../elements/chatList/Header';
import ChatSearch from '../elements/chatList/ChatSearch';
import ChatTab from '../elements/chatList/ChatTab';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { setActiveReceiver } from '@client/redux/features/userSlices/homeSlices/commonSlices/activeReceiverSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@client/redux/store';
import { GroupChatListType, SearchResultType } from '@bro/shared';

type ChatListProps<T> = {
  chatListData: T[];
  activeSectionTab: string;
};

const ChatList = <T extends SearchResultType | GroupChatListType>({
  chatListData,
  activeSectionTab,
}: ChatListProps<T>) => {
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

  const handleUserClick = (
    receiverAndChatDetails: SearchResultType | GroupChatListType
  ) => {
    const conversationId =
      'conversationId' in receiverAndChatDetails
        ? receiverAndChatDetails.conversationId
        : receiverAndChatDetails._id?.toString();

    const name =
      'name' in receiverAndChatDetails
        ? receiverAndChatDetails.name
        : receiverAndChatDetails.groupName;

    const isGroup = 'conversationId' in receiverAndChatDetails ? false : true;
    dispatch(
      setActiveReceiver({
        receiver: {
          ...receiverAndChatDetails,
          conversationId: conversationId ?? null,
          name,
          isGroup,
        },
      })
    );
  };

  return (
    <div className=" h-screen w-full select-none">
      <Card className="flex flex-col w-full h-screen gap-1 items-center bg-white shadow-[1px_0px_0px_#00000014] p-0 rounded-none">
        <Header tab={activeSectionTab} />

        <div className="flex flex-col items-start w-full flex-1 min-h-0">
          <ChatSearch tab={activeSectionTab} />

          <div className="flex flex-col gap-2 custom-scrollbar px-4 py-0 w-full overflow-y-auto flex-1 min-h-0 overflow-x-hidden!">
            {chatListData.map((receiverTab, index) => {
              const isDM = activeSectionTab === 'DMs';

              const conversationId =
                'conversationId' in receiverTab
                  ? receiverTab.conversationId
                  : receiverTab._id.toString();

              const isOnline =
                isDM && 'isOnline' in receiverTab
                  ? browserIsOnline && receiverTab.isOnline
                  : false;

              const isTyping =
                isDM && 'isTyping' in receiverTab
                  ? browserIsOnline && receiverTab.isTyping
                  : false;

              const unreadCount = conversationId
                ? newMessages[conversationId]?.length
                : 0;

              const lastMessage = conversationId
                ? newMessages[conversationId]?.[
                    newMessages[conversationId].length - 1
                  ]?.content ?? ''
                : '';

              const ContentType = conversationId
                ? newMessages[conversationId]?.[
                    newMessages[conversationId].length - 1
                  ]?.MessageType
                : 'text';

              const chatName =
                'name' in receiverTab
                  ? receiverTab.name
                  : receiverTab.groupName;

              return (
                <ChatTab
                  key={index}
                  onClick={() => handleUserClick(receiverTab)}
                  lastMessageOrUserName={lastMessage}
                  ContentType={ContentType}
                  onlineStatus={isOnline}
                  isTyping={isTyping}
                  unreadCount={unreadCount}
                  avatar={receiverTab.avatar || ''}
                  chatName={chatName || ''}
                  className={
                    activeReceiver?.conversationId === conversationId
                      ? 'bg-[#f3f3f3]'
                      : ''
                  }
                />
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatList;
