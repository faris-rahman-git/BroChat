import { RootState } from '@client/redux/store';
import { Receiver } from '@client/types/ReduxTypes';
import { useSelector } from 'react-redux';
import { GroupChatListType, GroupFixedData } from '@bro/shared';
import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  deleteFileApi,
  uploadFileApi,
} from '@client/services/home/commonServices';
import { useUpdateGroupInfoForm } from '@client/hooks/home/groupHooks/logic/useUpdateGroupInfoForm';
import { useRemoveGroupMemberForm } from '@client/hooks/home/groupHooks/logic/useRemoveGroupMemberForm';
import { useMakeGroupAdminForm } from '@client/hooks/home/groupHooks/logic/useMakeGroupAdminForm';
import { useDismissGroupAdminForm } from '@client/hooks/home/groupHooks/logic/useDismissGroupAdminForm';
import { useBlockUserForm } from '@client/hooks/home/dmHooks/logic/useBlockUserForm';
import { useUnBlockUserForm } from '@client/hooks/home/dmHooks/logic/useUnBlockUserForm';
import { useExitFromGroupForm } from '@client/hooks/home/groupHooks/logic/useExitFromGroupForm';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';

export const useChatInfoModalHook = (
  isOpen: boolean,
  receiverDetails: Receiver,
  group?: GroupChatListType
) => {
  const dispatch = useAppDispatch();

  const userDetails = useSelector((state: RootState) => state.user);
  const groupTabs = ['Overview', 'Members'];
  const dmTabs = ['Overview'];

  const tabs = receiverDetails.isGroup ? groupTabs : dmTabs;
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(receiverDetails.name || '');
  const [editedDescription, setEditedDescription] = useState(
    receiverDetails.about || ''
  );
  const [editedAvatar, setEditedAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(
    receiverDetails.avatar || ''
  );
  const [openBlockModal, setOpenBlockModal] = useState(false);
  const [openExitModal, setOpenExitModal] = useState(false);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(receiverDetails.isGroup ? groupTabs[0] : dmTabs[0]);
    }
  }, [isOpen, receiverDetails.isGroup]);

  useEffect(() => {
    if (isOpen) {
      setEditedName(receiverDetails.name || '');
      setEditedDescription(receiverDetails.about || '');
      setAvatarPreview(receiverDetails.avatar || '');
    }
  }, [isEditing, isOpen]);

  const { mutate: deleteMutate, isPending: deleteIsPending } = useMutation({
    mutationFn: deleteFileApi,
    onError: (err) => {
      console.error('Upload error:', err.message);
    },
  });

  const { mutate: uploadMutate, isPending: uploadIsPending } = useMutation({
    mutationFn: uploadFileApi,
    onSuccess: (mediaUrl) => {
      handleUpdateGroupInfo(mediaUrl);
    },
    onError: (err) => {
      console.error('Upload error:', err.message);
    },
  });

  const { updateGroupInfoMutate } = useUpdateGroupInfoForm(receiverDetails);
  const { removeMemberMutate } = useRemoveGroupMemberForm(receiverDetails);
  const { makeAdminMutate } = useMakeGroupAdminForm(receiverDetails);
  const { dismissAdminMutate } = useDismissGroupAdminForm(receiverDetails);
  const { blockUserMutate } = useBlockUserForm(receiverDetails);
  const { unBlockUserMutate } = useUnBlockUserForm(receiverDetails);
  const { exitMutate } = useExitFromGroupForm(receiverDetails);

  const handleSaveGroupInfo = () => {
    setIsEditing(false);
    if (
      editedName.trim() == receiverDetails.name &&
      editedDescription.trim() == receiverDetails.about &&
      avatarPreview == receiverDetails.avatar
    ) {
      return;
    }
    if (avatarPreview !== receiverDetails.avatar) {
      if (receiverDetails.avatar && receiverDetails.avatar != '') {
        deleteMutate(receiverDetails.avatar);
      }
      if (editedAvatar) {
        uploadMutate({
          file: editedAvatar,
          fileType: 'image',
          extension: 'png',
        });
        return;
      } else {
        handleUpdateGroupInfo('');
      }
    } else {
      handleUpdateGroupInfo(receiverDetails.avatar);
    }
  };

  const handleUpdateGroupInfo = (imageUrl: string) => {
    updateGroupInfoMutate({
      conversationId: receiverDetails.conversationId!,
      groupInfo: {
        groupName: editedName,
        about: editedDescription,
        avatar: imageUrl,
      },
    });
  };

  const handleRemoveMember = (memberId: string) => {
    removeMemberMutate({
      conversationId: receiverDetails.conversationId!,
      memberId,
    });
  };

  const handleMakeOrDismissAdmin = (memberId: string, isAdmin: boolean) => {
    if (isAdmin) {
      dismissAdminMutate({
        conversationId: receiverDetails.conversationId!,
        memberId,
      });
    } else {
      const adminLength = group?.Admins.length ?? 0;
      const isPaid = group?.isPaid ?? false;
      if (adminLength >= GroupFixedData.Admin_limit && !isAdmin && !isPaid)
        return;
      makeAdminMutate({
        conversationId: receiverDetails.conversationId!,
        memberId,
      });
    }
  };

  const handleBlockUser = () => {
    setOpenBlockModal(false);
    if (receiverDetails.isBlockedByMe) {
      unBlockUserMutate(receiverDetails.conversationId as string);
    } else {
      blockUserMutate(receiverDetails.conversationId as string);
    }
  };

  const handleExitFromGroup = () => {
    exitMutate(receiverDetails.conversationId!);
  };

  useEffect(() => {
    const isPending = deleteIsPending || uploadIsPending;
    dispatch(isPending ? showLoader() : hideLoader());
  }, [deleteIsPending, uploadIsPending]);

  return {
    userId: userDetails.id as string,
    receiverDetails,
    group,
    handleSaveGroupInfo,
    handleRemoveMember,
    handleMakeOrDismissAdmin,
    handleBlockUser,
    handleExitFromGroup,
    openBlockModal,
    setOpenBlockModal,
    openExitModal,
    setOpenExitModal,
    openUpgradeModal,
    setOpenUpgradeModal,
    isEditing,
    setIsEditing,
    editedName,
    setEditedName,
    editedDescription,
    setEditedDescription,
    avatarPreview,
    setAvatarPreview,
    setEditedAvatar,
    fileInputRef,
    activeTab,
    openInviteModal,
    setOpenInviteModal,
    openReportModal,
    setOpenReportModal,
    userDetails,
    tabs ,
    setActiveTab
  };
};
