import { UserReduxType } from '@client/types/ReduxTypes';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import React from 'react';
import { BsPatchCheckFill } from 'react-icons/bs';

function ProfileDefaultTopView({
  userDetails,
}: {
  userDetails: UserReduxType;
}) {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="relative size-[60px] flex-shrink-0 rounded-[6px] overflow-hidden">
        <Avatar className="size-full flex justify-center items-center bg-[#C9C9C9] rounded-[6px]">
          <AvatarImage
            src={userDetails.avatar || ''}
            alt={userDetails.name || ''}
            className="w-full h-full object-cover rounded-[6px]"
          />
          <AvatarFallback className="text-center rounded-[6px] bg-[#C9C9C9]">
            {userDetails.name?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-col items-center mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-md font-semibold text-center py-3">
            {userDetails.name}
          </h2>
          {userDetails?.isSubscribed && (
            <BsPatchCheckFill className="text-blue-500 size-4 flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-gray-500">@{userDetails.username}</p>
      </div>
    </div>
  );
}

export default React.memo(ProfileDefaultTopView);
