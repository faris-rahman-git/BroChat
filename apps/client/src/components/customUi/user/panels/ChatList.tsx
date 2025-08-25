import { Card } from '@client/components/ui/card';
import Header from '../elements/chatList/Header';
import ChatSearch from '../elements/chatList/ChatSearch';
import { GroupChatListType, SearchResultType } from '@bro/shared';
import ChatTabButton from '@client/components/customUi/commonElemets/ChatTabButton';
import { useChatListHook } from '@client/hooks/PageHooks/user/HomePage/Home/panels/ChatList/useChatListHook';

type ChatListProps<T> = {
  chatListData: T[];
  activeSectionTab: string;
};

const ChatList = <T extends SearchResultType | GroupChatListType>({
  chatListData,
  activeSectionTab,
}: ChatListProps<T>) => {
  const {
    setSearchQuery,
    filteredChatList,
    handleUserClick,
    newMessages,
    activeReceiver,
    browserIsOnline,
  } = useChatListHook(chatListData);

  return (
    <div className=" h-screen w-full select-none">
      <Card className="flex flex-col w-full h-screen gap-1 items-center bg-white shadow-[1px_0px_0px_#00000014] p-0 rounded-none">
        <Header tab={activeSectionTab} />

        <div className="flex flex-col items-start w-full flex-1 min-h-0">
          <ChatSearch tab={activeSectionTab} onSearchChange={setSearchQuery} />

          <div className="flex flex-col gap-2 custom-scrollbar px-4 py-0 w-full overflow-y-auto flex-1 min-h-0 overflow-x-hidden!">
            {filteredChatList.map((receiverTab, index) => {
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

              const isPaid =
                'isPaid' in receiverTab ? receiverTab.isPaid : false;

              const isSubscribed =
                'isSubscribed' in receiverTab
                  ? receiverTab.isSubscribed
                  : false;

              return (
                <ChatTabButton
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
                  isPaid={isPaid}
                  isSubscribed={isSubscribed}
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
