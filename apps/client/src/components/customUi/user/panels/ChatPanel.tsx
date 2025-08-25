import ChatPanelTop from '../elements/chatPanel/ChatPanelTop';
import ChatPanelMiddle from '../elements/chatPanel/ChatPanelMiddle';
import ChatPanelBottom from '../elements/chatPanel/ChatPanelBottom';
import CallPanel from '../elements/chatPanel/CallPanel';
import ExclusiveUserModal from '../elements/chatPanel/ExclusiveUserModal';
import ReplyInput from '../elements/chatPanel/ReplyInput';
import { useChatPanelHook } from '@client/hooks/PageHooks/user/HomePage/Home/panels/ChatPanel/useChatPanelHook';

function ChatPanel() {
  const {
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
    onReplyData,
  } = useChatPanelHook();

  if (receiverDetails.isExclusive && (!activeChatId || activeChatId === '')) {
    return (
      <div className="bg-[#f3f3f3] h-screen flex flex-col items-center justify-center">
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => setShowExclusiveModal(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m4-6a4 4 0 10-8 0v6a4 4 0 108 0v-6z"
            />
          </svg>
          <span className="text-gray-700 mt-2 font-medium">
            Exclusive Chat Locked
          </span>
        </div>

        <ExclusiveUserModal
          open={showExclusiveModal}
          onOpenChange={setShowExclusiveModal}
          userDetails={userDetails}
          receiverId={receiverDetails.receiverId as string}
        />
      </div>
    );
  }

  return (
    <div className="bg-[#f3f3f3] h-screen flex flex-col">
      <ChatPanelTop
        avatar={receiverDetails.avatar as string}
        name={receiverDetails.name as string}
        isOnline={browserIsOnline && (receiverDetails.isOnline as boolean)}
        isTyping={browserIsOnline && (receiverDetails.isTyping as boolean)}
        isGroup={receiverDetails.isGroup ? true : false}
      />

      {activeSectionTab !== 'Calls' ? (
        <>
          <ChatPanelMiddle
            messages={messages}
            userDetails={userDetails}
            isTyping={receiverDetails.isTyping as boolean}
            isGroup={receiverDetails.isGroup ? true : false}
            conversationId={activeChatId}
            onReply={handleReply}
            onReplyData={onReplyData}
          />

          {receiverDetails.isBlockedByMe ||
          receiverDetails.hasBlockedMe ||
          receiverDetails.isBlocked ? null : (
            <>
              <ReplyInput
                replyTo={onReplyData}
                onCancelReply={handleCancelReply}
                userId={userDetails.id as string}
              />

              <ChatPanelBottom
                onSend={handleSendMessage}
                receiverId={receiverDetails.receiverId as string}
              />
            </>
          )}
        </>
      ) : (
        <CallPanel
          conversationId={activeChatId}
          userId={userDetails.id as string}
        />
      )}
    </div>
  );
}

export default ChatPanel;
