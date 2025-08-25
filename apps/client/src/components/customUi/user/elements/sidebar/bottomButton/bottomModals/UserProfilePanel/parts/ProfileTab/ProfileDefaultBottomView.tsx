import { Button } from '@client/components/ui/button';
import { ProfileUpdateInfoParams } from '@bro/shared';
import React from 'react';

function ProfileDefaultBottomView({
  setIsEditing,
  profileData,
}: {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  profileData: ProfileUpdateInfoParams;
}) {
  return (
    <>
      <div className="flex justify-between items-center w-full mb-2">
        <h3 className="font-semibold py-1">About</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </Button>
      </div>
      <p className="text-xs text-gray-500 w-full whitespace-pre-wrap">
        {profileData.about || 'No about info'}
      </p>

      <div className="flex flex-col mt-3 w-full">
        <h3 className=" font-semibold py-1">Phone</h3>
        <p className="text-xs text-gray-500">
          {profileData.phoneNumber || '-'}
        </p>
      </div>

      <div className="flex flex-col mt-3 w-full">
        <h3 className=" font-semibold py-1">Email</h3>
        <p className="text-xs text-gray-500">{profileData.email}</p>
      </div>
    </>
  );
}

export default React.memo(ProfileDefaultBottomView);
