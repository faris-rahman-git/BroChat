import ChatList from '@client/components/customUi/user/panels/ChatList';
import { setChatListSize } from '@client/redux/features/commonSlices/chatListSizeSlice';
import { RootState } from '@client/redux/store';
import { useSelector } from 'react-redux';
import CustomResizablePanels from '../../customUi/commonElemets/CustomResizablePanels';
import WellCome from '@client/components/customUi/user/panels/WellCome';
import ChatPanel from '@client/components/customUi/user/panels/ChatPanel';
import { getSocket } from '@client/configs/socket';
import { useCallback, useEffect } from 'react';
import {
  EditMessageType,
  GroupChatListType,
  GroupMember,
  MessageType,
  SearchResultType,
  SubscriptionDetailsType,
  updateGroupInfoType,
} from '@bro/shared';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import {
  addNewMessage,
  deleteOneMessage,
  editOneMessage,
} from '@client/redux/features/userSlices/homeSlices/messageSlice/newMessagesSlice';
import { emitWithQueue } from '@client/lib/socket/emitWithQueue';
import {
  clearActiveReceiver,
  setTypingStatus,
  updateActiveReceiver,
  updateBlockGroupStatus,
  updateBlockUserStatus,
} from '@client/redux/features/userSlices/homeSlices/commonSlices/activeReceiverSlice';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useOneToOneChatList } from '@client/hooks/home/dmHooks/useOneToOneChatList';
import { useGroupChatList } from '@client/hooks/home/groupHooks/useGroupChatList';
import {
  addUserIfNotExists,
  changeChatToTop,
  setChatList,
  setUserOnlineStatus,
  setUserTypingStatus,
  updateAUserPremiumStatus,
  updateBlockedUser,
} from '@client/redux/features/userSlices/homeSlices/dmSlices/oneToOneChatSlice';
import {
  addGroupIfNotExists,
  addGroupMembers,
  changeGroupChatToTop,
  dismissGroupAdmin,
  groupBlockUpdate,
  makeGroupAdmin,
  makeGroupPremium,
  removeGroupChat,
  removeGroupMember,
  setGroupChatList,
  updateGroupInfo,
} from '@client/redux/features/userSlices/homeSlices/groupSlice/groupChatSlice';
import {
  deleteMessage,
  editMessage,
} from '@client/redux/features/userSlices/homeSlices/messageSlice/messageHistorySlice';
import { updateSubscriptionDetails } from '@client/redux/features/userSlices/authSlices/userSlice';

function Home() {
  //redux
  const dispatch = useAppDispatch();
  const size = useSelector((state: RootState) => state.chatListSize.size);
  const activeReceiver = useSelector(
    (state: RootState) => state.activeReceiver
  );
  const activeSectionTab = useSelector(
    (state: RootState) => state.activeSectionTab.value
  );
  const oneToOneChatListData = useSelector(
    (state: RootState) => state.oneToOneChat.chatList
  );
  const groupChatListData = useSelector(
    (state: RootState) => state.groupChat.groupList
  );

  //api hooks
  const {
    isPending: oneToOneIsPending,
    isSuccess: oneToOneIsSuccess,
    isError: oneToOneIsError,
    mutate: oneToOneMutate,
    error: oneToOneError,
    data: oneToOneData,
  } = useOneToOneChatList();
  useEffect(() => {
    if (oneToOneIsSuccess) {
      dispatch(setChatList(oneToOneData.usersList));
    }
  }, [oneToOneIsSuccess]);

  const {
    isPending: groupIsPending,
    isSuccess: groupIsSuccess,
    isError: groupIsError,
    mutate: groupMutate,
    error: groupError,
    data: groupData,
  } = useGroupChatList();
  useEffect(() => {
    if (groupIsSuccess) {
      dispatch(setGroupChatList(groupData.groupList));
    }
  }, [groupIsSuccess]);

  useEffect(() => {
    oneToOneMutate();
    groupMutate();
  }, []);

  useEffect(() => {
    if (oneToOneIsError) {
      console.log(oneToOneError.message);
    }
    if (groupIsError) {
      console.log(groupError.message);
    }
  }, [oneToOneIsError, groupIsError]);
  useEffect(() => {
    const isLoading = oneToOneIsPending || groupIsPending;
    dispatch(isLoading ? showLoader() : hideLoader());
  }, [oneToOneIsPending, groupIsPending]);

  const handleResize = useCallback(
    (newSize: number) => {
      dispatch(setChatListSize(newSize));
    },
    [dispatch]
  );

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // 1. New message
    const handleNewMessage = async (
      data: MessageType,
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      dispatch(
        addNewMessage({
          conversationId: data.conversationId as string,
          message: data,
        })
      );
      dispatch(
        changeChatToTop({
          conversationId: data.conversationId as string,
        })
      );
      dispatch(
        changeGroupChatToTop({
          conversationId: data.conversationId as string,
        })
      );
      try {
        await emitWithQueue({
          event: 'message-status-updated',
          data: {
            messageId: data._id,
            senderId: data.senderId,
            status: 'delivered',
          },
        });
      } catch (err) {
        console.error('Failed to emit status update:', err);
      }
    };

    // 2. Online/offline status
    const updateUserOnlineStatus = (userId: string, status: boolean) => {
      dispatch(setUserOnlineStatus({ userId, status }));
    };
    const handleUserOnline = (
      userId: string,
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      updateUserOnlineStatus(userId, true);
    };
    const handleUserOffline = (
      userId: string,
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      updateUserOnlineStatus(userId, false);
    };

    // 3. Typing status
    const handleTypingStatus = (
      {
        senderId,
        status,
      }: {
        senderId: string;
        status: boolean;
      },
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      dispatch(setUserTypingStatus({ senderId, status }));
      dispatch(setTypingStatus({ status }));
    };

    // 4. New chats (DM or Group)
    const handleNewUserChat = (
      data: SearchResultType,
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);

      dispatch(addUserIfNotExists(data));
    };
    const handleNewGroupChat = (
      data: GroupChatListType,
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);

      dispatch(addGroupIfNotExists(data));
    };

    // 5. Delete message update
    const handleDeleteMessage = async (
      data: { conversationId: string; messageId: string },
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      dispatch(
        deleteMessage({
          conversationId: data.conversationId,
          messageId: data.messageId,
        })
      );
      dispatch(
        deleteOneMessage({
          conversationId: data.conversationId,
          messageId: data.messageId,
        })
      );
    };

    //6. edit message update
    const handleEditMessage = async (
      data: EditMessageType,
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      dispatch(editMessage(data));
      dispatch(editOneMessage(data));
    };

    //7. remove group chat
    const handleRemoveGroupChat = async (
      data: { conversationId: string },
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      dispatch(removeGroupChat(data.conversationId));
      dispatch(clearActiveReceiver(data.conversationId));
    };

    //8. remove group member
    const handleRemoveGroupMember = async (
      data: { conversationId: string; memberId: string },
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      dispatch(
        removeGroupMember({
          conversationId: data.conversationId,
          memberId: data.memberId,
        })
      );
    };

    //9. make group admin
    const handleMakeGroupAdmin = async (
      data: { conversationId: string; memberId: string },
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      dispatch(
        makeGroupAdmin({
          conversationId: data.conversationId!,
          memberId: data.memberId,
        })
      );
    };

    //10. dismiss group admin
    const handleDismissGroupAdmin = async (
      data: { conversationId: string; memberId: string },
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      dispatch(
        dismissGroupAdmin({
          conversationId: data.conversationId!,
          memberId: data.memberId,
        })
      );
    };

    //11. add group members
    const handleAddGroupMembers = async (
      data: { newMemberDetails: GroupMember[]; conversationId: string },
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      dispatch(
        addGroupMembers({
          conversationId: data.conversationId!,
          newMemberDetails: data.newMemberDetails,
        })
      );
    };

    //12. update group info
    const handleUpdateGroupInfo = async (
      data: { conversationId: string; groupInfo: updateGroupInfoType },
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      dispatch(
        updateGroupInfo({
          conversationId: data.conversationId!,
          groupInfo: data.groupInfo,
        })
      );
      dispatch(
        updateActiveReceiver({
          conversationId: data.conversationId!,
          groupInfo: data.groupInfo,
        })
      );
    };

    //13. block user update
    const handleBlockUser = async (
      data: {
        conversationId: string;
        hasBlockedMe?: boolean;
      },
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      dispatch(
        updateBlockedUser({
          conversationId: data.conversationId,
          hasBlockedMe: data.hasBlockedMe,
        })
      );
      dispatch(
        updateBlockUserStatus({
          conversationId: data.conversationId,
          hasBlockedMe: data.hasBlockedMe,
        })
      );
    };

    //14.Make Group Premium
    const handleMakeGroupPremium = async (
      data: {
        conversationId: string;
      },
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      dispatch(
        makeGroupPremium({
          conversationId: data.conversationId,
        })
      );
    };

    //14. update subscription details
    const handleUpdateSubscriptionDetails = async (
      data: SubscriptionDetailsType,
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      dispatch(updateSubscriptionDetails({ data }));
    };

    //15. update user premium status
    const handleUpdateUserPremiumStatus = async (
      { isSubscribed, userId }: { isSubscribed: boolean; userId: string },
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      dispatch(
        updateAUserPremiumStatus({
          isSubscribed,
          userId,
        })
      );
    };

    //15. group soft delete
    const handleGroupSoftDelete = async (
      { conversationId }: { conversationId: string },
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      dispatch(removeGroupChat(conversationId));
      dispatch(clearActiveReceiver(conversationId));
    };

    //15. group block update
    const handleGroupBlockUpdate = async (
      {
        conversationId,
        isBlocked,
      }: { conversationId: string; isBlocked: boolean },
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      dispatch(
        groupBlockUpdate({
          conversationId,
          isBlocked,
        })
      );
      dispatch(
        updateBlockGroupStatus({
          conversationId,
          isBlocked,
        })
      );
    };

    //  Attach all listener
    socket.on('new-message', handleNewMessage);
    socket.on('user-online', handleUserOnline);
    socket.on('user-offline', handleUserOffline);
    socket.on('typing-status', handleTypingStatus);
    socket.on('new-group-chat', handleNewGroupChat);
    socket.on('new-user-chat', handleNewUserChat);
    socket.on('delete-message', handleDeleteMessage);
    socket.on('edit-message-update', handleEditMessage);
    socket.on('remove-group-chat', handleRemoveGroupChat);
    socket.on('remove-group-member', handleRemoveGroupMember);
    socket.on('make-group-admin', handleMakeGroupAdmin);
    socket.on('dismiss-group-admin', handleDismissGroupAdmin);
    socket.on('add-group-members', handleAddGroupMembers);
    socket.on('update-group-info', handleUpdateGroupInfo);
    socket.on('block-user-update', handleBlockUser);
    socket.on('make-group-premium', handleMakeGroupPremium);
    socket.on('update-subscription-details', handleUpdateSubscriptionDetails);
    socket.on('update-user-premium-status', handleUpdateUserPremiumStatus);
    socket.on('group-soft-delete', handleGroupSoftDelete);
    socket.on('group-block-update', handleGroupBlockUpdate);

    return () => {
      socket.off('new-message', handleNewMessage);
      socket.off('user-online', handleUserOnline);
      socket.off('user-offline', handleUserOffline);
      socket.off('typing-status', handleTypingStatus);
      socket.off('new-user-chat', handleNewUserChat);
      socket.off('new-group-chat', handleNewGroupChat);
      socket.off('delete-message', handleDeleteMessage);
      socket.off('edit-message-update', handleEditMessage);
      socket.off('remove-group-chat', handleRemoveGroupChat);
      socket.off('remove-group-member', handleRemoveGroupMember);
      socket.off('make-group-admin', handleMakeGroupAdmin);
      socket.off('dismiss-group-admin', handleDismissGroupAdmin);
      socket.off('add-group-members', handleAddGroupMembers);
      socket.off('update-group-info', handleUpdateGroupInfo);
      socket.off('block-user-update', handleBlockUser);
      socket.off('make-group-premium', handleMakeGroupPremium);
      socket.off(
        'update-subscription-details',
        handleUpdateSubscriptionDetails
      );
      socket.off('update-user-premium-status', handleUpdateUserPremiumStatus);
      socket.off('group-soft-delete', handleGroupSoftDelete);
      socket.off('group-block-update', handleGroupBlockUpdate);
    };
  }, []);

  return (
    <CustomResizablePanels
      left={
        activeSectionTab === 'DMs' ? (
          <ChatList<SearchResultType>
            chatListData={oneToOneChatListData}
            activeSectionTab={activeSectionTab}
          />
        ) : (
          <ChatList<GroupChatListType>
            chatListData={groupChatListData}
            activeSectionTab={activeSectionTab}
          />
        )
      }
      right={activeReceiver.conversationId == '' ? <WellCome /> : <ChatPanel />}
      minSize={350}
      maxSize={600}
      onResize={handleResize}
      defaultSize={size}
    />
  );
}

export default Home;
