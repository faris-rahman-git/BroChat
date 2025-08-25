import { RootState } from '@client/redux/store';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { SearchResultType, GroupChatListType } from '@bro/shared';
import { setActiveReceiver } from '@client/redux/features/userSlices/homeSlices/commonSlices/activeReceiverSlice';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';

export const useChatListHook = <T extends SearchResultType | GroupChatListType>(
  chatListData: T[]
) => {
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

  const [searchQuery, setSearchQuery] = useState('');
  const filteredChatList = useMemo(() => {
    return chatListData.filter((item) => {
      const name = 'name' in item ? item.name : item.groupName || '';

      return name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [chatListData, searchQuery]);

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

  return {
    setSearchQuery,
    filteredChatList,
    handleUserClick,
    newMessages,
    activeReceiver,
    browserIsOnline,
  };
};
