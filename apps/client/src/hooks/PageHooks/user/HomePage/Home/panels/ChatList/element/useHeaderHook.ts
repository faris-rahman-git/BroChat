import useClickOutside from '@client/hooks/commonHooks/useClickOutside';
import { RootState } from '@client/redux/store';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

export const useHeaderHook = () => {
  const [activeTab, setActiveTab] = useState('');
  const oneToOneChatListData = useSelector(
    (state: RootState) => state.oneToOneChat.chatList
  );
  const handleButtons = (label: string) => {
    setActiveTab(label);
  };

  const newChatRef = useRef<HTMLDivElement>(null);
  const createGroupRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: newChatRef,
    onClickOutside: () => {
      if (activeTab === 'New Chat') setActiveTab('');
    },
  });

  useClickOutside({
    ref: createGroupRef,
    onClickOutside: () => {
      if (activeTab === 'Create Group') setActiveTab('');
    },
  });

  return {
    activeTab,
    handleButtons,
    oneToOneChatListData,
    newChatRef,
    createGroupRef,
    setActiveTab,
  };
};
