import { Button } from '@client/components/ui/button';
import { Input } from '@client/components/ui/input';
import { Textarea } from '@client/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import React from 'react';
import { BsPatchCheckFill } from 'react-icons/bs';
import { LuImagePlus } from 'react-icons/lu';
import { format } from 'date-fns';
import { Receiver } from '@client/types/ReduxTypes';
import { GroupChatListType } from '@bro/shared';

function OverviewTab({
  userId,
  handleSaveGroupInfo,
  setOpenBlockModal,
  setOpenExitModal,
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
  setOpenReportModal,
  receiverDetails,
  group,
}: {
  userId: string;
  handleSaveGroupInfo: () => void;
  setOpenBlockModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenExitModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenUpgradeModal: React.Dispatch<React.SetStateAction<boolean>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  editedName: string;
  setEditedName: React.Dispatch<React.SetStateAction<string>>;
  editedDescription: string;
  setEditedDescription: React.Dispatch<React.SetStateAction<string>>;
  avatarPreview: string;
  setAvatarPreview: React.Dispatch<React.SetStateAction<string>>;
  setEditedAvatar: React.Dispatch<React.SetStateAction<File | null>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  setOpenReportModal: React.Dispatch<React.SetStateAction<boolean>>;
  receiverDetails: Receiver;
  group: GroupChatListType | undefined;
}) {
  return (
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
            <p className="text-xs text-gray-500">{receiverDetails.username}</p>
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
                    onChange={(e) => setEditedDescription(e.target.value)}
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
                  <Button className=" text-sm" onClick={handleSaveGroupInfo}>
                    Save
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold py-1">Description:</h3>
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
                  <h3 className="text-sm font-semibold py-1">Created At:</h3>
                  <p className="text-xs text-gray-500">
                    {format(
                      new Date(
                        receiverDetails.createdAt || '2025-07-10T08:38:01.572Z'
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
                <h3 className="text-sm font-semibold py-1">Phone Number :</h3>
                <p className="text-xs text-gray-500 ">
                  +91 {receiverDetails.phoneNumber}
                </p>
              </div>
            )}
            <div className="flex flex-col mb-2">
              <h3 className="text-sm font-semibold py-1">Email :</h3>
              <p className="text-xs text-gray-500 ">{receiverDetails.email}</p>
            </div>
            <div className="flex flex-col mb-2">
              <h3 className="text-sm font-semibold py-1">Created At :</h3>
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
  );
}

export default React.memo(OverviewTab);
