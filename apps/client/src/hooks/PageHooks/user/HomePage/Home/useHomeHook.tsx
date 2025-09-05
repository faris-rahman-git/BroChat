import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { useCallListForm } from '@client/hooks/home/callHooks/logic/useCallListForm';
import { useOneToOneChatListForm } from '@client/hooks/home/dmHooks/logic/useOneToOneChatListForm';
import { useGroupChatListForm } from '@client/hooks/home/groupHooks/logic/useGroupChatListForm';
import { RootState } from '@client/redux/store';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  SearchResultType,
  GroupChatListType,
  callListType,
  MessageType,
  EditMessageType,
  GroupMember,
  updateGroupInfoType,
  SubscriptionDetailsType,
  findConversationNameType,
  ReactionsType,
} from '@bro/shared';
import { setChatListSize } from '@client/redux/features/commonSlices/chatListSizeSlice';
import { useCallAcceptForm } from '@client/hooks/home/callHooks/logic/useCallAcceptForm';
import { useCallRejectForm } from '@client/hooks/home/callHooks/logic/useCallRejectFrom';
import {
  addNewMessage,
  deleteOneMessage,
  editOneMessage,
} from '@client/redux/features/userSlices/homeSlices/messageSlice/newMessagesSlice';
import {
  addUserIfNotExists,
  changeChatToTop,
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
  updateGroupInfo,
} from '@client/redux/features/userSlices/homeSlices/groupSlice/groupChatSlice';
import { emitWithQueue } from '@client/lib/socket/emitWithQueue';
import { getSocket } from '@client/configs/socket';
import {
  clearActiveReceiver,
  setTypingStatus,
  updateActiveReceiver,
  updateBlockGroupStatus,
  updateBlockUserStatus,
} from '@client/redux/features/userSlices/homeSlices/commonSlices/activeReceiverSlice';
import {
  addReaction,
  deleteMessage,
  editMessage,
  removeReaction,
  replaceMessageByTempId,
} from '@client/redux/features/userSlices/homeSlices/messageSlice/messageHistorySlice';
import { updateSubscriptionDetails } from '@client/redux/features/userSlices/authSlices/userSlice';
import { toast } from 'react-toastify';
import CallInviteToast from '../../../../../components/customUi/commonElemets/CallInviteToast';

export const useHomeHook = () => {
  const toastIds = useRef(new Map<any, any>());

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  //redux
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
  const callList = useSelector((state: RootState) => state.callList.callList);

  const [combinedCallChats, setCombinedCallChats] = useState<
    (SearchResultType | GroupChatListType)[]
  >([]);
  const [openExpiredSubscriptionModal, setOpenExpiredSubscriptionModal] =
    useState(false);

  const { oneToOneMutate } = useOneToOneChatListForm();
  const { groupMutate } = useGroupChatListForm();
  const { callMutate } = useCallListForm();
  const { callAcceptMutate } = useCallAcceptForm();
  const { callRejectMutate } = useCallRejectForm();

  useEffect(() => {
    if (!oneToOneChatListData || !groupChatListData || !callList) return;

    const merged = [...oneToOneChatListData, ...groupChatListData].filter(
      (chat) => {
        const conversationId =
          'conversationId' in chat ? chat.conversationId : chat._id?.toString();

        return callList.some(
          (call: callListType) => call.conversationId === conversationId
        );
      }
    );

    setCombinedCallChats(merged);
  }, [oneToOneChatListData, groupChatListData, callList]);

  useEffect(() => {
    oneToOneMutate();
    groupMutate();
    callMutate();
  }, []);

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

    //16. group soft delete
    const handleGroupSoftDelete = async (
      { conversationId }: { conversationId: string },
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      dispatch(removeGroupChat(conversationId));
      dispatch(clearActiveReceiver(conversationId));
    };

    //17. group block update
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

    //18. Call Invite
    const handleCallInvite = async (
      {
        userdata,
        callUrl,
        isVideoCall,
        isGroupCall,
        roomId,
      }: {
        userdata: findConversationNameType;
        callUrl: string;
        isVideoCall: boolean;
        isGroupCall: boolean;
        roomId: string;
      },
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);

      const id = toast(
        ({ closeToast }) => (
          <CallInviteToast
            name={userdata.name}
            avatar={userdata.avatar}
            isVideoCall={isVideoCall}
            onAccept={() => {
              closeToast();
              callAcceptMutate({ joinedAt: new Date(), roomId });
              navigate(callUrl);
            }}
            onReject={() => {
              closeToast();
              callRejectMutate({ isGroupCall, roomId });
            }}
          />
        ),
        {
          position: 'top-right',
          autoClose: 30_000,
          closeOnClick: false,
          closeButton: false,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          draggable: false,
        }
      );

      // store toast ID so we can close later
      toastIds.current.set(roomId, id);
    };

    //19. call cut
    const handleCallCut = async (
      { roomId }: { roomId: string },
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      const id = toastIds.current.get(roomId);
      if (id) {
        toast.dismiss(id);
        toastIds.current.delete(roomId);
      }
    };

    //20. Message Status Sent
    const handleMessageStatusSent = async (
      data: { tempId: string; savedMessage: MessageType },
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      dispatch(
        replaceMessageByTempId({
          conversationId: data.savedMessage.conversationId as string,
          tempId: data.tempId,
          savedMessage: data.savedMessage,
        })
      );
    };

    //21. Add Reaction
    const handleAddReaction = async (
      data: {
        payload: ReactionsType;
        conversationId: string;
        messageId: string;
      },
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      dispatch(
        addReaction({
          conversationId: data.conversationId,
          messageId: data.messageId,
          reaction: data.payload,
        })
      );
    };

    //22. Remove Reaction
    const handleRemoveReaction = async (
      data: {
        userId: string;
        conversationId: string;
        messageId: string;
      },
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      dispatch(
        removeReaction({
          conversationId: data.conversationId,
          messageId: data.messageId,
          userId: data.userId,
        })
      );
    };

    //22. Subscription Expired
    const handleSubscriptionExpired = async (
      data: null,
      ack?: (status: boolean) => void
    ) => {
      if (typeof ack === 'function') ack(true);
      setOpenExpiredSubscriptionModal(true);
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
    socket.on('call-invite', handleCallInvite);
    socket.on('call-cut', handleCallCut);
    socket.on('message-status-sent', handleMessageStatusSent);
    socket.on('add-reaction', handleAddReaction);
    socket.on('remove-reaction', handleRemoveReaction);
    socket.on('subscription-expired-notification', handleSubscriptionExpired);

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
      socket.off('call-invite', handleCallInvite);
      socket.off('call-cut', handleCallCut);
      socket.off('message-status-sent', handleMessageStatusSent);
      socket.off('add-reaction', handleAddReaction);
      socket.off('remove-reaction', handleRemoveReaction);
      socket.off('subscription-expired-notification', handleRemoveReaction);
    };
  }, []);

  return {
    handleResize,
    combinedCallChats,
    size,
    activeReceiver,
    activeSectionTab,
    groupChatListData,
    oneToOneChatListData,
    openExpiredSubscriptionModal,
    setOpenExpiredSubscriptionModal,
    dispatch,
  };
};
