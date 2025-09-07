import { Input } from '@client/components/ui/input';
import React from 'react';
import { ProfileUpdateInfoParams } from '@bro/shared';
import { UserReduxType } from '@client/types/ReduxTypes';
import { Textarea } from '@client/components/ui/textarea';
import { Button } from '@client/components/ui/button';

function ProfileEditView({
  fileInputRef,
  userDetails,
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
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  userDetails: UserReduxType;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  profileData: ProfileUpdateInfoParams;
  setEditedAvatar: React.Dispatch<React.SetStateAction<File | null>>;
  setAvatarPreview: React.Dispatch<React.SetStateAction<string>>;
  avatarPreview: string;
  editData: ProfileUpdateInfoParams;
  setEditData: React.Dispatch<React.SetStateAction<ProfileUpdateInfoParams>>;
  updateProfileInfoIsError: boolean;
  updateProfileInfoError: Error | null;
  handleSaveProfileInfo: () => void;
}) {
  return (
    <>
      {/* Avatar Edit */}
      <div className="flex flex-col mb-2">
        <label className="text-sm font-semibold py-1">Avatar</label>
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

        <div className="w-[70px] h-[70px] rounded-[6px] bg-white border border-gray-300 mt-2">
          {avatarPreview ? (
            <div className="relative w-full h-full group">
              <img
                src={avatarPreview}
                alt="Avatar Preview"
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
              className="w-full h-full flex items-center justify-center cursor-pointer"
            >
              <span className="text-xl text-gray-400">+</span>
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <div className="flex flex-col mb-2">
        <label className="text-sm font-semibold py-1">Name</label>
        <Input
          className="text-xs border rounded px-2 py-1 focus-visible:border-[#615EF0] focus-visible:ring-0"
          value={editData.name}
          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
        />
      </div>

      {/* Username */}
      <div className="flex flex-col mb-2">
        <label className="text-sm font-semibold py-1">Username</label>
        <Input
          className="text-xs border rounded px-2 py-1 focus-visible:border-[#615EF0] focus-visible:ring-0"
          value={editData.username}
          onChange={(e) =>
            setEditData({
              ...editData,
              username: e.target.value,
            })
          }
          disabled={!userDetails.isSubscribed ? true : false}
        />
        {updateProfileInfoIsError && (
          <span className="text-xs text-red-500 mt-1">
            {(updateProfileInfoError as any)?.response?.data?.message}
          </span>
        )}
      </div>

      {/* About */}
      <div className="flex flex-col mb-2">
        <label className="text-sm font-semibold py-1">About</label>
        <Textarea
          className="text-xs border rounded px-2 py-1 focus-visible:border-[#615EF0] focus-visible:ring-0"
          rows={3}
          value={editData.about}
          onChange={(e) => setEditData({ ...editData, about: e.target.value })}
        />
      </div>

      {/* Phone Number */}
      <div className="flex flex-col mb-2">
        <label className="text-sm font-semibold py-1">Phone Number</label>
        <Input
          className="text-xs border rounded px-2 py-1 focus-visible:border-[#615EF0] focus-visible:ring-0"
          type="number"
          value={editData.phoneNumber as number}
          onChange={(e) =>
            setEditData({
              ...editData,
              phoneNumber: Number(e.target.value),
            })
          }
        />
      </div>

      {/* Email */}
      <div className="flex flex-col mb-2">
        <label className="text-sm font-semibold py-1">Email</label>
        <Input
          className="text-xs border rounded px-2 py-1 bg-gray-100"
          value={editData.email}
          disabled
        />
      </div>

      <div className="flex justify-end gap-2 my-3">
        <Button
          variant="ghost"
          className="text-sm"
          onClick={() => {
            setEditData(profileData);
            setIsEditing(false);
            setAvatarPreview(profileData.avatar || '');
            setEditedAvatar(null);
          }}
        >
          Cancel
        </Button>
        <Button
          className="text-sm"
          onClick={() => {
            handleSaveProfileInfo();
          }}
        >
          Save
        </Button>
      </div>
    </>
  );
}

export default React.memo(ProfileEditView);
