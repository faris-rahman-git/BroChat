import { Card } from '@client/components/ui/card';
import { UserReduxType } from '@client/types/ReduxTypes';
import CustomModals from '@client/components/customUi/commonElemets/CustomModals';
import { PlanType } from '@bro/shared';
import ProfileTab from './UserProfilePanel/tabs/ProfileTab';
import HelpTab from './UserProfilePanel/tabs/HelpTab';
import ExclusiveTab from './UserProfilePanel/tabs/ExclusiveTab';
import TransactionsTab from './UserProfilePanel/tabs/TransactionsTab';
import ProfileSidebar from './UserProfilePanel/parts/ProfileSidebar';
import { useUserProfilePanelHook } from '@client/hooks/PageHooks/user/HomePage/HomeLayoutSideBar/BottomButtons/modal/useUserProfilePanelHook';

interface UserProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  userDetails: UserReduxType;
  logOut: () => void;
  setExclusiveMakePlanModalOpen: () => void;
  exclusivePlan: PlanType | null;
  openEditExclusivePlanModal: () => void;
}

const UserProfilePanel = ({
  isOpen,
  onClose,
  userDetails,
  logOut,
  setExclusiveMakePlanModalOpen,
  exclusivePlan,
  openEditExclusivePlanModal,
}: UserProfilePanelProps) => {
  const {
    isEditing,
    setIsEditing,
    profileData,
    editData,
    setEditData,
    avatarPreview,
    setAvatarPreview,
    setEditedAvatar,
    handleSaveProfileInfo,
    openDeleteModal,
    handleDeleteAccount,
    transactions,
    fileInputRef,
    setOpenDeleteModal,
    updateProfileInfoError,
    updateProfileInfoIsError,
    panelRef,
    selectedTab,
    setSelectedTab,
  } = useUserProfilePanelHook(userDetails, onClose, logOut);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 flex items-end sm:justify-start">
      <div ref={panelRef} className="m-3">
        <Card className="flex flex-row p-0 w-[650px] h-[600px] rounded-[6px] overflow-hidden border border-gray-300 shadow-md">
          <ProfileSidebar
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            userDetails={userDetails}
          />

          <div className="flex-1 bg-white flex flex-col items-center px-6 pt-6 overflow-y-auto">
            {selectedTab === 'Profile' && (
              <ProfileTab
                fileInputRef={fileInputRef}
                userDetails={userDetails}
                setIsEditing={setIsEditing}
                profileData={profileData}
                setEditedAvatar={setEditedAvatar}
                setAvatarPreview={setAvatarPreview}
                avatarPreview={avatarPreview}
                editData={editData}
                setEditData={setEditData}
                updateProfileInfoIsError={updateProfileInfoIsError}
                updateProfileInfoError={updateProfileInfoError}
                handleSaveProfileInfo={handleSaveProfileInfo}
                isEditing={isEditing}
              />
            )}
            {selectedTab === 'Help' && (
              <HelpTab setOpenDeleteModal={setOpenDeleteModal} />
            )}
            {selectedTab === 'Exclusive' && (
              <ExclusiveTab
                exclusivePlan={exclusivePlan}
                openEditExclusivePlanModal={openEditExclusivePlanModal}
                setExclusiveMakePlanModalOpen={setExclusiveMakePlanModalOpen}
                userDetails={userDetails}
              />
            )}
            {selectedTab === 'Transactions' && (
              <TransactionsTab transactions={transactions} />
            )}
          </div>
        </Card>
      </div>
      <CustomModals
        open={openDeleteModal}
        onOpenChange={setOpenDeleteModal}
        onConfirm={handleDeleteAccount}
        title={'Delete my account permanently'}
        description={
          'Are you sure ? Do you want to permanently Delete your account? This action cannot be undone.'
        }
        confirmText={'Delete my account permanently'}
      />
    </div>
  );
};

export default UserProfilePanel;
