import CustomModals from '../../../../commonElemets/CustomModals';
import { Button } from '@client/components/ui/button';
import { GroupChatListType } from '@bro/shared';
import { Receiver } from '@client/types/ReduxTypes';
import AddMembersModal from './ChatInfoModal/AddMembersModal';
import ReportModal from './ChatInfoModal/ReportModal';
import UpgradeGroupModal from './ChatInfoModal/UpgradeGroupModal';
import OverviewTab from './ChatInfoModal/OverviewTab';
import MembersTab from './ChatInfoModal/MembersTab';
import { useChatInfoModalHook } from '@client/hooks/PageHooks/user/HomePage/Home/panels/ChatPanel/element/ChatPanelTop/useChatInfoModalHook';

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
  const {
    userId,
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
    tabs,
    setActiveTab,
  } = useChatInfoModalHook(isOpen, receiverDetails, group);

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
            <OverviewTab
              userId={userId}
              handleSaveGroupInfo={handleSaveGroupInfo}
              setOpenBlockModal={setOpenBlockModal}
              setOpenExitModal={setOpenExitModal}
              setOpenUpgradeModal={setOpenUpgradeModal}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              editedName={editedName}
              setEditedName={setEditedName}
              editedDescription={editedDescription}
              setEditedDescription={setEditedDescription}
              avatarPreview={avatarPreview}
              setAvatarPreview={setAvatarPreview}
              setEditedAvatar={setEditedAvatar}
              fileInputRef={fileInputRef}
              setOpenReportModal={setOpenReportModal}
              receiverDetails={receiverDetails}
              group={group}
            />
          )}

          {activeTab === 'Members' && receiverDetails.isGroup && (
            <MembersTab
              userId={userId}
              group={group}
              handleRemoveMember={handleRemoveMember}
              handleMakeOrDismissAdmin={handleMakeOrDismissAdmin}
              setOpenInviteModal={setOpenInviteModal}
            />
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
