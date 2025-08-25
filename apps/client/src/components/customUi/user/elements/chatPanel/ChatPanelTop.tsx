import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import { ChatPanelTopConstants } from '@client/constants/userConstant/chatPanelConstants';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { BsPatchCheckFill } from 'react-icons/bs';
import ThankYouForSubscribingModal from '@client/components/customUi/commonElemets/ThankYouForSubscribingModal';
import ChatInfoModal from './ChatPanelTop/ChatInfoModal';
import { useChatPanelTopHook } from '@client/hooks/PageHooks/user/HomePage/Home/panels/ChatPanel/element/useChatPanelTopHook';

function ChatPanelTop({
  avatar,
  name,
  isOnline,
  isTyping,
  isGroup,
}: {
  avatar: string;
  name: string;
  isOnline: boolean;
  isTyping: boolean;
  isGroup: boolean;
}) {
  const {
    openInfoModal,
    setOpenInfoModal,
    showThankYouModal,
    setShowThankYouModal,
    handleCalls,
    group,
    receiverDetails,
  } = useChatPanelTopHook(isGroup);

  return (
    <header className="flex items-center justify-between p-6 h-[78px]  bg-white">
      <div
        className="flex items-center gap-4 hover:cursor-pointer"
        onClick={() => {
          setOpenInfoModal(true);
        }}
      >
        {/* avatar */}
        <div className="relative size-[45px] flex-shrink-0   rounded-[6px] overflow-hidden">
          <Avatar className="size-full flex justify-center items-center bg-[#c9c9c9]">
            <AvatarImage
              src={avatar}
              alt={name}
              className="object-cover size-full"
            />
            <AvatarFallback className="text-center ">
              {name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-xl">{name}</h2>
            {(group?.isPaid || receiverDetails?.isSubscribed) && (
              <BsPatchCheckFill className="text-blue-500 size-4 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {isTyping && !isGroup ? (
              // Typing Indicator
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-[#615EF0] animate-pulse" />
                <div className="flex items-center gap-0.5 text-xs text-[#615EF0] font-medium">
                  <span className="animate-pulse">Typing</span>
                  <span className="animate-bounce">.</span>
                  <span
                    className="animate-bounce"
                    style={{ animationDelay: '100ms' }}
                  >
                    .
                  </span>
                  <span
                    className="animate-bounce"
                    style={{ animationDelay: '200ms' }}
                  >
                    .
                  </span>
                </div>
              </div>
            ) : !isGroup ? (
              // Online / Offline Status
              <>
                <div
                  className={`size-2 rounded-full ${
                    isOnline ? 'bg-red-700' : 'bg-gray-400'
                  }`}
                />
                <span className="opacity-60 font-medium text-xs">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center flex-row gap-2">
        {ChatPanelTopConstants.map(({ icon: Icon, label }, index) => (
          <ButtonIcon
            key={index}
            Icon={Icon}
            label={label}
            iconClassName="size-5"
            onClick={() => handleCalls(label)}
          ></ButtonIcon>
        ))}
      </div>

      {openInfoModal && (
        <ChatInfoModal
          isOpen={openInfoModal}
          onOpenChange={() => setOpenInfoModal(false)}
          group={group}
          receiverDetails={receiverDetails}
          setShowThankYouModal={() => setShowThankYouModal(true)}
        />
      )}

      <ThankYouForSubscribingModal
        open={showThankYouModal}
        onClose={() => setShowThankYouModal(false)}
      />
    </header>
  );
}

export default ChatPanelTop;
