import logo from '@client/assets/logo/chatLogo.webp';
import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import { useState } from 'react';
import { LuFilter, LuUserPlus } from 'react-icons/lu';
import { useRef } from 'react';
import useClickOutside from '@client/hooks/commonHooks/useClickOutside';
import AddUserCard from './header/AddUserCard';
import FilterCard from './header/FilterCard';

function Header() {
  const [activeTab, setActiveTab] = useState('');

  const handleButtons = (label: string) => {
    setActiveTab(label);
  };

  const filterRef = useRef<HTMLDivElement>(null);
  const newChatRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: filterRef,
    onClickOutside: () => {
      if (activeTab === 'Filter') setActiveTab('');
    },
  });

  useClickOutside({
    ref: newChatRef,
    onClickOutside: () => {
      if (activeTab === 'New Chat') setActiveTab('');
    },
  });

  const buttons = [
    { icon: LuUserPlus, label: 'New Chat' },
    { icon: LuFilter, label: 'Filter' },
  ];

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
              {label === 'Filter' && activeTab === 'Filter' && (
                <FilterCard filterRef={filterRef} />
              )}
              {label === 'New Chat' && activeTab === 'New Chat' && (
                <AddUserCard
                  newChatRef={newChatRef}
                  setActiveTab={setActiveTab}
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
