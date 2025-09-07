import { UserReduxType } from '@client/types/ReduxTypes';
import ProfileDefaultTopView from '../parts/ProfileTab/ProfileDefaultTopView';
import { ProfileUpdateInfoParams } from '@bro/shared';
import ProfileDefaultBottomView from '../parts/ProfileTab/ProfileDefaultBottomView';
import React from 'react';
import ProfileEditView from '../parts/ProfileTab/ProfileEditView';

function ProfileTab({
  userDetails,
  isEditing,
  fileInputRef,
  setIsEditing,
  profileData,
  setEditedAvatar,
  setAvatarPreview,
  avatarPreview,
  setEditData,
  editData,
  updateProfileInfoIsError,
  updateProfileInfoError,
  handleSaveProfileInfo,
}: {
  userDetails: UserReduxType;
  isEditing: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  setIsEditing:React.Dispatch<React.SetStateAction<boolean>>;
  profileData: ProfileUpdateInfoParams;
  setEditedAvatar: React.Dispatch<React.SetStateAction<File | null>>
  setAvatarPreview: React.Dispatch<React.SetStateAction<string>>

  avatarPreview: string;
  editData: ProfileUpdateInfoParams;
  setEditData: React.Dispatch<React.SetStateAction<ProfileUpdateInfoParams>>

  updateProfileInfoIsError: boolean;
  updateProfileInfoError: Error | null;
  handleSaveProfileInfo: () => void;
}) {
  return (
    <div className="w-full">
      {!isEditing && <ProfileDefaultTopView userDetails={userDetails} />}

      <div>
        {isEditing ? (
          <ProfileEditView
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
          />
        ) : (
          <ProfileDefaultBottomView
            setIsEditing={setIsEditing}
            profileData={profileData}
          />
        )}
      </div>
    </div>
  );
}

export default React.memo(ProfileTab);
