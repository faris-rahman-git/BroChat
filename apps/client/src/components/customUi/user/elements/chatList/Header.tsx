import logo from '@client/assets/logo/chatLogo.webp';
import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import { LuUserPlus } from 'react-icons/lu';
import AddUserCard from './header/AddUserCard';
import { MdAddCall, MdOutlineGroupAdd } from 'react-icons/md';
import CreateNewGroup from './header/CreateNewGroup';
import { useHeaderHook } from '@client/hooks/PageHooks/user/HomePage/Home/panels/ChatList/element/useHeaderHook';

function Header({ tab }: { tab: string }) {
  const {
    activeTab,
    handleButtons,
    oneToOneChatListData,
    newChatRef,
    createGroupRef,
    setActiveTab,
  } = useHeaderHook();

  const buttons =
    tab === 'DMs'
      ? [{ icon: LuUserPlus, label: 'New Chat' }]
      : tab === 'Groups'
      ? [{ icon: MdOutlineGroupAdd, label: 'Create Group' }]
      : [{ icon: MdAddCall, label: 'Start Call' }];

  return (
    <header className="inline-flex flex-col items-center w-full py-3 h-[78px] border-b-[.5px] border-[#0000012]">
      <div className="flex w-full items-center justify-between px-5">
        <div className="h-[100%] w-[50%]">
          <img
            src={logo}
            alt="BroChat Logo"
            className="h-13 w-auto object-contain"
          />
        </div>
        <div className="h-[100%] w-[50%] flex items-center justify-end gap-3 ">
          {buttons.map(({ icon: Icon, label }, index) => (
            <div className="relative" key={index}>
              <ButtonIcon
                Icon={Icon}
                label={label}
                iconClassName="size-5"
                className={` ${activeTab === label ? 'bg-[#f5f5f5]' : ''}`}
                onClick={() => handleButtons(label)}
              ></ButtonIcon>
              {label === 'New Chat' && activeTab === 'New Chat' && (
                <AddUserCard
                  newChatRef={newChatRef}
                  setActiveTab={setActiveTab}
                />
              )}
              {label === 'Create Group' && activeTab === 'Create Group' && (
                <CreateNewGroup
                  newChatRef={createGroupRef}
                  setActiveTab={setActiveTab}
                  oneToOneChatListData={oneToOneChatListData}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Header;
