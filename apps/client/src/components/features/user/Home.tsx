import ChatList from '@client/components/customUi/user/panels/ChatList';
import CustomResizablePanels from '../../customUi/commonElemets/CustomResizablePanels';
import WellCome from '@client/components/customUi/user/panels/WellCome';
import ChatPanel from '@client/components/customUi/user/panels/ChatPanel';
import { GroupChatListType, SearchResultType } from '@bro/shared';
import { ToastContainer } from 'react-toastify';
import { useHomeHook } from '@client/hooks/PageHooks/user/HomePage/Home/useHomeHook';

function Home() {
  const {
    handleResize,
    combinedCallChats,
    size,
    activeReceiver,
    activeSectionTab,
    groupChatListData,
    oneToOneChatListData,
  } = useHomeHook();

  return (
    <>
      <CustomResizablePanels
        left={
          activeSectionTab === 'DMs' ? (
            <ChatList<SearchResultType>
              chatListData={oneToOneChatListData}
              activeSectionTab={activeSectionTab}
            />
          ) : activeSectionTab === 'Groups' ? (
            <ChatList<GroupChatListType>
              chatListData={groupChatListData}
              activeSectionTab={activeSectionTab}
            />
          ) : (
            <ChatList<SearchResultType | GroupChatListType>
              chatListData={combinedCallChats}
              activeSectionTab={activeSectionTab}
            />
          )
        }
        right={
          activeReceiver.conversationId == '' ? <WellCome /> : <ChatPanel />
        }
        minSize={350}
        maxSize={600}
        onResize={handleResize}
        defaultSize={size}
      />
      <ToastContainer />
    </>
  );
}

export default Home;
