import { useEffect, useState } from 'react';
import CustomModals from '../../../../commonElemets/CustomModals';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@client/components/ui/avatar';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@client/components/ui/context-menu';
import { useSelector } from 'react-redux';
import { RootState } from '@client/redux/store';
import { Button } from '@client/components/ui/button';
import { format } from 'date-fns';
import ReportModal from '../../chatList/chatTab/ReportModal';
import ChatTabButton from '../../chatList/chatTab/ChatTabButton';
import { MdRemoveCircleOutline } from 'react-icons/md';
import {
  LuArrowBigDownDash,
  LuArrowBigUpDash,
  LuUserPlus,
} from 'react-icons/lu';
import { useRemoveGroupMember } from '@client/hooks/home/groupHooks/useRemoveGroupMember';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import {
  dismissGroupAdmin,
  makeGroupAdmin,
  removeGroupChat,
  removeGroupMember,
  updateGroupInfo,
} from '@client/redux/features/userSlices/homeSlices/groupSlice/groupChatSlice';
import { useMakeGroupAdmin } from '@client/hooks/home/groupHooks/useMakeGroupAdmin';
import { useDismissGroupAdmin } from '@client/hooks/home/groupHooks/useDismissGroupAdmin';
import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import AddMembersModal from './AddMembersModal';
import { Input } from '@client/components/ui/input';
import { Textarea } from '@client/components/ui/textarea';
import { useUpdateGroupInfo } from '@client/hooks/home/groupHooks/useUpdateGroupInfo';
import {
  clearActiveReceiver,
  updateActiveReceiver,
  updateBlockUserStatus,
} from '@client/redux/features/userSlices/homeSlices/commonSlices/activeReceiverSlice';
import { useRef } from 'react';
import { LuImagePlus } from 'react-icons/lu';
import { useMutation } from '@tanstack/react-query';
import {
  deleteFileApi,
  uploadFileApi,
} from '@client/services/home/commonServices';
import { useBlockUser } from '@client/hooks/home/dmHooks/useBlockUser';
import { updateBlockedUser } from '@client/redux/features/userSlices/homeSlices/dmSlices/oneToOneChatSlice';
import { useUnBlockUser } from '@client/hooks/home/dmHooks/useUnBlockUser';
import { GroupChatListType, GroupFixedData } from '@bro/shared';
import { Receiver } from '@client/types/ReduxTypes';
import { BsPatchCheckFill } from 'react-icons/bs';
import UpgradeGroupModal from './UpgradeGroupModal';
import { useExitFromGroup } from '@client/hooks/home/groupHooks/useExitFromGroup';

type Props = {
  isOpen: boolean;
  onOpenChange: () => void;
  receiverDetails: Receiver;
  group?: GroupChatListType;
  setShowThankYouModal: () => void;
};

function ChatInfoModal({
  isOpen,
  onOpenChange,
  receiverDetails,
  group,
  setShowThankYouModal,
}: Props) {
  const userDetails = useSelector((state: RootState) => state.user);
  const userId = userDetails.id;
  const dispatch = useAppDispatch();
  const groupTabs = [
    'Overview',
    'Members',
    // 'Media',
    // 'Files',
  ];
  const dmTabs = [
    'Overview',
    // 'Media',
    // 'Files'
  ];

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

  //media delete or upload
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

  //update group info
  const {
    mutate: updateGroupInfoMutate,
    isPending: updateGroupInfoIsPending,
    isSuccess: updateGroupInfoIsSuccess,
    data: updateGroupInfoData,
  } = useUpdateGroupInfo();
  useEffect(() => {
    if (updateGroupInfoIsSuccess) {
      dispatch(
        updateGroupInfo({
          conversationId: receiverDetails.conversationId!,
          groupInfo: updateGroupInfoData.groupInfo,
        })
      );
      dispatch(
        updateActiveReceiver({
          conversationId: receiverDetails.conversationId!,
          groupInfo: updateGroupInfoData.groupInfo,
        })
      );
    }
  }, [updateGroupInfoIsSuccess]);

  
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

  //remove member
  const {
    isPending: removeMemberIsPending,
    isSuccess: removeMemberIsSuccess,
    mutate: removeMemberMutate,
    data: removeMemberData,
  } = useRemoveGroupMember();
  useEffect(() => {
    if (removeMemberIsSuccess) {
      dispatch(
        removeGroupMember({
          conversationId: receiverDetails.conversationId!,
          memberId: removeMemberData.memberId,
        })
      );
      dispatch(
        dismissGroupAdmin({
          conversationId: receiverDetails.conversationId!,
          memberId: removeMemberData.memberId,
        })
      );
    }
  }, [removeMemberIsSuccess]);
  const handleRemoveMember = (memberId: string) => {
    removeMemberMutate({
      conversationId: receiverDetails.conversationId!,
      memberId,
    });
  };

  //make Group admin
  const {
    isPending: makeAdminIsPending,
    isSuccess: makeAdminIsSuccess,
    mutate: makeAdminMutate,
    data: makeAdminData,
  } = useMakeGroupAdmin();
  useEffect(() => {
    if (makeAdminIsSuccess) {
      dispatch(
        makeGroupAdmin({
          conversationId: receiverDetails.conversationId!,
          memberId: makeAdminData.memberId,
        })
      );
    }
  }, [makeAdminIsSuccess]);

  // dismiss Group admin
  const {
    isPending: dismissAdminIsPending,
    isSuccess: dismissAdminIsSuccess,
    mutate: dismissAdminMutate,
    data: dismissAdminData,
  } = useDismissGroupAdmin();
  useEffect(() => {
    if (dismissAdminIsSuccess) {
      dispatch(
        dismissGroupAdmin({
          conversationId: receiverDetails.conversationId!,
          memberId: dismissAdminData.memberId,
        })
      );
    }
  }, [dismissAdminIsSuccess]);
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

  //block/unblock user
  const [openBlockModal, setOpenBlockModal] = useState(false);
  const {
    isPending: blockUserIsPending,
    isSuccess: blockUserIsSuccess,
    mutate: blockUserMutate,
  } = useBlockUser();
  const {
    isPending: unBlockUserIsPending,
    isSuccess: unBlockUserIsSuccess,
    mutate: unBlockUserMutate,
  } = useUnBlockUser();
  const handleBlockUser = () => {
    setOpenBlockModal(false);
    if (receiverDetails.isBlockedByMe) {
      unBlockUserMutate(receiverDetails.conversationId as string);
    } else {
      blockUserMutate(receiverDetails.conversationId as string);
    }
  };
  useEffect(() => {
    const isPending = blockUserIsPending || unBlockUserIsPending;
    dispatch(isPending ? showLoader() : hideLoader());
  }, [blockUserIsPending, unBlockUserIsPending]);
  useEffect(() => {
    if (blockUserIsSuccess) {
      dispatch(
        updateBlockedUser({
          conversationId: receiverDetails.conversationId as string,
          isBlockedByMe: true,
        })
      );
      dispatch(
        updateBlockUserStatus({
          conversationId: receiverDetails.conversationId as string,
          isBlockedByMe: true,
        })
      );
    }
  }, [blockUserIsSuccess]);
  useEffect(() => {
    if (unBlockUserIsSuccess) {
      dispatch(
        updateBlockedUser({
          conversationId: receiverDetails.conversationId as string,
          isBlockedByMe: false,
        })
      );
      dispatch(
        updateBlockUserStatus({
          conversationId: receiverDetails.conversationId as string,
          isBlockedByMe: false,
        })
      );
    }
  }, [unBlockUserIsSuccess]);

  //exit from group
  const [openExitModal, setOpenExitModal] = useState(false);
  const {
    isPending: exitIsPending,
    mutate: exitMutate,
    isSuccess: exitIsSuccess,
  } = useExitFromGroup();
  useEffect(() => {
    if (exitIsSuccess) {
      dispatch(removeGroupChat(receiverDetails.conversationId!));
      dispatch(clearActiveReceiver(receiverDetails.conversationId!));
    }
  }, [exitIsSuccess]);

  const handleExitFromGroup = () => {
    exitMutate(receiverDetails.conversationId!);
  };

  //Upgrade Group
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);

  //gobal pending
  useEffect(() => {
    const isPending =
      makeAdminIsPending ||
      removeMemberIsPending ||
      dismissAdminIsPending ||
      updateGroupInfoIsPending ||
      deleteIsPending ||
      uploadIsPending ||
      exitIsPending;
    dispatch(isPending ? showLoader() : hideLoader());
  }, [
    removeMemberIsPending,
    makeAdminIsPending,
    dismissAdminIsPending,
    updateGroupInfoIsPending,
    deleteIsPending,
    uploadIsPending,
    exitIsPending,
  ]);

  return (
    <CustomModals
      open={isOpen}
      onOpenChange={onOpenChange}
      onConfirm={() => {}}
      isNormal={false}
    >
      <div className=" w-full h-[600px] bg-white  flex">
        {/* Sidebar Tabs */}
        <aside className="w-[120px] border-r p-3 space-y-2">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant="ghost"
              className={`w-full text-left p-2 rounded text-sm ${
                activeTab === tab ? 'bg-gray-100 font-semibold' : ''
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          {activeTab === 'Overview' && (
            <div>
              {!isEditing && (
                <div className="flex flex-col justify-center items-center">
                  <div className="relative size-[60px] flex-shrink-0   rounded-[6px] overflow-hidden">
                    <Avatar className="size-full flex justify-center items-center bg-[#C9C9C9] rounded-[6px]">
                      <AvatarImage
                        src={receiverDetails.avatar || ''}
                        alt={receiverDetails.name || ''}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-center rounded-[6px] bg-[#C9C9C9]">
                        {receiverDetails.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex flex-col items-center mb-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-md font-semibold text-center py-3">
                        {receiverDetails.name}
                      </h2>
                      {(group?.isPaid || receiverDetails?.isSubscribed) && (
                        <BsPatchCheckFill className="text-blue-500 size-4 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {receiverDetails.username}
                    </p>
                  </div>
                </div>
              )}

              <div>
                {receiverDetails.isGroup ? (
                  <>
                    {isEditing ? (
                      <>
                        {/* avatar edit */}
                        <div className="flex flex-col mb-2">
                          <label className="text-sm font-semibold py-1">
                            Group Avatar:
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setEditedAvatar(file);
                                const previewUrl = URL.createObjectURL(file);
                                setAvatarPreview(previewUrl);
                              }
                            }}
                            style={{ display: 'none' }}
                          />
                          <div className="w-[70px] h-[70px] rounded-[6px] bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 mt-2">
                            {avatarPreview ? (
                              <div className="relative w-full h-full group">
                                <img
                                  src={avatarPreview}
                                  alt="Group Avatar"
                                  className="w-full h-full object-cover rounded-[6px]"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs transition-opacity rounded-[6px]">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      fileInputRef.current?.click();
                                    }}
                                    className="hover:underline mb-1 hover:cursor-pointer"
                                  >
                                    Change
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditedAvatar(null);
                                      setAvatarPreview('');
                                    }}
                                    className="hover:underline hover:cursor-pointer"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div
                                onClick={() => fileInputRef.current?.click()}
                                className="cursor-pointer"
                              >
                                <LuImagePlus className="w-8 h-8" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col mb-2">
                          <label className="text-sm font-semibold py-1">
                            Group Name:
                          </label>
                          <Input
                            className="text-xs border rounded px-2 py-1 focus-visible:border-[#615EF0] focus-visible:ring-0"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                          />
                        </div>

                        <div className="flex flex-col mb-2">
                          <label className="text-sm font-semibold py-1">
                            Description:
                          </label>
                          <Textarea
                            className="text-xs border rounded px-2 py-1 focus-visible:border-[#615EF0] focus-visible:ring-0"
                            rows={4}
                            value={editedDescription}
                            onChange={(e) =>
                              setEditedDescription(e.target.value)
                            }
                          />
                        </div>

                        <div className="flex gap-2 mt-3 justify-end">
                          <Button
                            className=" text-sm "
                            variant="ghost"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            className=" text-sm"
                            onClick={handleSaveGroupInfo}
                          >
                            Save
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-sm font-semibold py-1">
                            Description:
                          </h3>
                          {group?.Admins?.includes(userId!) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                              onClick={() => setIsEditing(true)}
                            >
                              Edit
                            </Button>
                          )}
                        </div>

                        <p className="text-xs text-gray-500 whitespace-pre-wrap">
                          {receiverDetails.about || 'No description provided.'}
                        </p>

                        <div className="flex flex-col mb-2 mt-3">
                          <h3 className="text-sm font-semibold py-1">
                            Created At:
                          </h3>
                          <p className="text-xs text-gray-500">
                            {format(
                              new Date(
                                receiverDetails.createdAt ||
                                  '2025-07-10T08:38:01.572Z'
                              ),
                              'M/dd/yyyy h:mm a'
                            )}
                          </p>
                        </div>
                        {group?.Admins?.includes(userId!) && !group?.isPaid && (
                          <Button
                            variant="ghost"
                            className="mt-4 border p-2 rounded w-full text-sm"
                            onClick={() => {
                              setOpenUpgradeModal(true);
                            }}
                          >
                            Upgrade Group
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          className="mt-4 border p-2 rounded w-full text-sm"
                          onClick={() => setOpenExitModal(true)}
                        >
                          Exit Group
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex flex-col mb-2">
                      <h3 className="text-sm font-semibold py-1">About :</h3>
                      <p className="text-xs text-gray-500 max-h-50px ">
                        {receiverDetails.about}
                      </p>
                    </div>
                    {receiverDetails.phoneNumber && (
                      <div className="flex flex-col mb-2">
                        <h3 className="text-sm font-semibold py-1">
                          Phone Number :
                        </h3>
                        <p className="text-xs text-gray-500 ">
                          +91 {receiverDetails.phoneNumber}
                        </p>
                      </div>
                    )}
                    <div className="flex flex-col mb-2">
                      <h3 className="text-sm font-semibold py-1">Email :</h3>
                      <p className="text-xs text-gray-500 ">
                        {receiverDetails.email}
                      </p>
                    </div>
                    <div className="flex flex-col mb-2">
                      <h3 className="text-sm font-semibold py-1">
                        Created At :
                      </h3>
                      <p className="text-xs text-gray-500">
                        {format(
                          new Date('2025-07-10T08:38:01.572Z'),
                          'M/dd/yyyy h:mm a'
                        )}
                      </p>
                    </div>
                    {receiverDetails.conversationId &&
                      receiverDetails.conversationId != '' && (
                        <>
                          <Button
                            variant="ghost"
                            className="mt-4 border p-2 rounded w-full text-sm"
                            onClick={() => setOpenBlockModal(true)}
                          >
                            {receiverDetails.isBlockedByMe
                              ? 'Unblock User'
                              : 'Block User'}
                          </Button>
                          <Button
                            variant="ghost"
                            className="mt-4 border p-2 rounded w-full text-sm"
                            onClick={() => setOpenReportModal(true)}
                          >
                            Report User
                          </Button>
                        </>
                      )}
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Members' && receiverDetails.isGroup && (
            <div>
              <div className="flex justify-between pb-2">
                <h2 className="text-lg font-bold mb-2">
                  Members ({group?.participants.length}
                  {group?.isPaid ? '' : '/ ' + GroupFixedData.Member_limit})
                </h2>
                {group?.Admins?.includes(userId!) && (
                  <ButtonIcon
                    Icon={LuUserPlus}
                    label="Invite"
                    disabled={
                      group.participants.length >=
                        GroupFixedData.Member_limit && !group.isPaid
                    }
                    onClick={() => setOpenInviteModal(true)}
                  />
                )}
              </div>
              {group?.participants.map((member) => {
                const isCurrentUser = member._id === userId;
                const isGroupAdmin = group?.Admins?.includes(member._id);

                if (!group?.Admins?.includes(userId!) || isCurrentUser) {
                  return (
                    <ChatTabButton
                      key={member._id}
                      avatar={member.avatar}
                      chatName={isCurrentUser ? 'You' : member.name}
                      avatarFallback={
                        member.name.charAt(0).toUpperCase() || 'U'
                      }
                      lastMessageOrUserName={member.username}
                      timeOrText={isGroupAdmin ? 'Admin' : ''}
                    />
                  );
                }

                return (
                  <ContextMenu key={member._id}>
                    <ContextMenuTrigger>
                      <ChatTabButton
                        avatar={member.avatar}
                        chatName={member.name}
                        avatarFallback={
                          member.name.charAt(0).toUpperCase() || 'U'
                        }
                        lastMessageOrUserName={member.username}
                        timeOrText={isGroupAdmin ? 'Admin' : ''}
                      />
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        inset
                        onClick={() => handleRemoveMember(member._id)}
                      >
                        Remove From Group
                        <ContextMenuShortcut>
                          <MdRemoveCircleOutline />
                        </ContextMenuShortcut>
                      </ContextMenuItem>
                      <ContextMenuItem
                        disabled={
                          group?.Admins.length >= GroupFixedData.Admin_limit &&
                          !isGroupAdmin &&
                          !group.isPaid
                        }
                        inset
                        onClick={() =>
                          handleMakeOrDismissAdmin(member._id, isGroupAdmin)
                        }
                      >
                        {isGroupAdmin ? 'Dismiss as Admin' : 'Make Group Admin'}
                        <ContextMenuShortcut>
                          {isGroupAdmin ? (
                            <LuArrowBigDownDash />
                          ) : (
                            <LuArrowBigUpDash />
                          )}
                        </ContextMenuShortcut>
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <AddMembersModal
        open={openInviteModal}
        onOpenChange={setOpenInviteModal}
        conversationId={receiverDetails.conversationId!}
        existingMemberIds={group?.participants.map((p) => p._id) || []}
        isPaid={group?.isPaid || false}
      />
      <ReportModal
        open={openReportModal}
        onOpenChange={setOpenReportModal}
        setOpenBlockModal={setOpenBlockModal}
        checkBlock={receiverDetails.isBlockedByMe}
      />
      <CustomModals
        open={openBlockModal}
        onOpenChange={setOpenBlockModal}
        onConfirm={handleBlockUser}
        title={receiverDetails.isBlockedByMe ? 'Unblock User' : 'Block User'}
        description={
          receiverDetails.isBlockedByMe
            ? `Are you sure ? Do you want to unblock ${receiverDetails.name}? This action can be undone.`
            : `Are you sure ? Do you want to block ${receiverDetails.name}? This action can be undone.`
        }
        confirmText={
          receiverDetails.isBlockedByMe ? 'Unblock User' : 'Block User'
        }
      />
      <CustomModals
        open={openExitModal}
        onOpenChange={setOpenExitModal}
        onConfirm={handleExitFromGroup}
        title={'Exit Group'}
        description={
          group?.participants?.length === 1
            ? `Are you sure? You're the last member of "${group.groupName}". Leaving will delete the group permanently.`
            : group?.Admins?.includes(userId!) && group?.Admins?.length === 1
            ? `You're the only admin in "${group?.groupName}". Please assign another admin before leaving, or one will be assigned automatically.`
            : `Are you sure you want to exit "${group?.groupName}"? You can rejoin later if invited.`
        }
        confirmText={
          group?.participants?.length === 1 ? 'Leave and Delete' : 'Exit Group'
        }
      />
      {/* Upgrade Group */}
      <UpgradeGroupModal
        open={openUpgradeModal}
        onOpenChange={setOpenUpgradeModal}
        conversationId={receiverDetails.conversationId!}
        userDetails={userDetails}
        closeInfoModal={onOpenChange}
        setShowThankYouModal={setShowThankYouModal}
      />
    </CustomModals>
  );
}

export default ChatInfoModal;
