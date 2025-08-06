import { HelpCircle, User, UserMinus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@client/components/ui/button';
import { Card } from '@client/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { BsPatchCheckFill } from 'react-icons/bs';
import { Textarea } from '@client/components/ui/textarea';
import { Input } from '@client/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import {
  deleteFileApi,
  uploadFileApi,
} from '@client/services/home/commonServices';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { useUpdateProfileInfo } from '@client/hooks/home/profileHooks/useUpdateProfileInfo';
import { updateProfileInfo } from '@client/redux/features/userSlices/authSlices/userSlice';
import { UserReduxType } from '@client/types/ReduxTypes';
import CustomModals from '@client/components/customUi/commonElemets/CustomModals';
import { useDeleteAccount } from '@client/hooks/home/profileHooks/useDeleteAccount';

interface UserProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  userDetails: UserReduxType;
  logOut: () => void;
}

const UserProfilePanel = ({
  isOpen,
  onClose,
  userDetails,
  logOut,
}: UserProfilePanelProps) => {
  const dispatch = useAppDispatch();
  const panelRef = useRef<HTMLDivElement>(null);
  const [selectedTab, setSelectedTab] = useState('Profile');
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: userDetails.name || '',
    username: userDetails.username || '',
    about: userDetails.about || '',
    phoneNumber: userDetails.phoneNumber || null,
    email: userDetails.email || '',
    avatar: userDetails.avatar || '',
  });

  const [editData, setEditData] = useState(profileData);
  const [editedAvatar, setEditedAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(userDetails.avatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newMediaUrl, setNewMediaUrl] = useState<string | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDeleteModal) return;

      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, openDeleteModal]);

  const menuItems = [
    { icon: <User size={20} />, label: 'Profile' },
    { icon: <UserMinus size={20} />, label: 'Exclusive' },
    { icon: <HelpCircle size={20} />, label: 'Help' },
  ];
  const {
    mutate: updateProfileInfoMutate,
    isPending: updateProfileInfoIsPending,
    isError: updateProfileInfoIsError,
    error: updateProfileInfoError,
    isSuccess: updateProfileInfoIsSuccess,
  } = useUpdateProfileInfo();

  const { mutate: deleteMutate, isPending: deleteIsPending } = useMutation({
    mutationFn: deleteFileApi,
    onError: (err) => {
      console.error('Upload error:', err.message);
    },
  });
  const { mutate: uploadMutate, isPending: uploadIsPending } = useMutation({
    mutationFn: uploadFileApi,
    onSuccess: (mediaUrl) => {
      setNewMediaUrl(mediaUrl);
      handleUpdateProfileInfo(mediaUrl);
    },
    onError: (err) => {
      console.error('Upload error:', err.message);
    },
  });

  useEffect(() => {
    if (updateProfileInfoIsError) {
      console.log('updateProfileInfoError', updateProfileInfoError);
      if (
        newMediaUrl &&
        newMediaUrl != '' &&
        newMediaUrl != profileData.avatar
      ) {
        deleteMutate(newMediaUrl);
      }
    }
  }, [updateProfileInfoIsError]);
  useEffect(() => {
    if (updateProfileInfoIsSuccess) {
      const updatedData = {
        ...editData,
        avatar: newMediaUrl !== null ? newMediaUrl : '',
      };

      setNewMediaUrl(null);
      setIsEditing(false);
      setProfileData(editData);
      dispatch(updateProfileInfo({ profileData: updatedData }));
    }
  }, [updateProfileInfoIsSuccess]);

  // Call this on Save button click
  const handleSaveProfileInfo = () => {
    const hasNoChange =
      editData.name.trim() === profileData.name &&
      editData.username.trim() === profileData.username &&
      editData.about.trim() === profileData.about &&
      editData.phoneNumber === profileData.phoneNumber &&
      avatarPreview === profileData.avatar;

    if (hasNoChange) return;

    if (avatarPreview !== profileData.avatar) {
      if (userDetails.avatar && userDetails.avatar != '') {
        deleteMutate(userDetails.avatar);
      }
      if (editedAvatar) {
        uploadMutate({
          file: editedAvatar,
          fileType: 'image',
          extension: 'png',
        });
        return;
      } else {
        handleUpdateProfileInfo('');
      }
    } else {
      handleUpdateProfileInfo(userDetails.avatar || '');
    }
  };

  // Update the actual profile info
  const handleUpdateProfileInfo = (imageUrl: string) => {
    updateProfileInfoMutate({
      userId: userDetails.id!,
      profileInfo: {
        ...editData,
        avatar: imageUrl,
      },
    });
  };

  //delete account permanently
  const {
    mutate: deleteAccountMutate,
    isPending: deleteAccountIsPending,
    isSuccess: deleteAccountIsSuccess,
  } = useDeleteAccount();
  useEffect(() => {
    if (deleteAccountIsSuccess) {
      logOut();
    }
  }, [deleteAccountIsSuccess]);

  const handleDeleteAccount = () => {
    deleteAccountMutate();
  };

  //gobal pending
  useEffect(() => {
    const isPending =
      deleteIsPending ||
      uploadIsPending ||
      updateProfileInfoIsPending ||
      deleteAccountIsPending;
    dispatch(isPending ? showLoader() : hideLoader());
  }, [
    deleteIsPending,
    uploadIsPending,
    updateProfileInfoIsPending,
    deleteAccountIsPending,
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 flex items-end sm:justify-start">
      <div ref={panelRef} className="m-3">
        <Card className="flex flex-row p-0 w-[650px] h-[600px] rounded-[6px] overflow-hidden border border-gray-300 shadow-md">
          {/* Sidebar */}
          <div className="w-[200px] h-full bg-[#f5f5f5] border-r border-gray-300 flex flex-col p-2">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                onClick={() => setSelectedTab(item.label)}
                className={`flex items-center justify-start h-11 w-full rounded-md mb-1 px-3 text-sm font-medium ${
                  selectedTab === item.label
                    ? 'bg-[#d1d1d1]'
                    : 'hover:bg-[#e8e8e8]'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white flex flex-col items-center px-6 pt-6 overflow-y-auto">
            {selectedTab === 'Profile' && (
              <div className="w-full">
                {!isEditing && (
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
                      <p className="text-xs text-gray-500">
                        @{userDetails.username}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  {isEditing ? (
                    <>
                      {/* Avatar Edit */}
                      <div className="flex flex-col mb-2">
                        <label className="text-sm font-semibold py-1">
                          Avatar
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
                        <label className="text-sm font-semibold py-1">
                          Name
                        </label>
                        <Input
                          className="text-xs border rounded px-2 py-1 focus-visible:border-[#615EF0] focus-visible:ring-0"
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                        />
                      </div>

                      {/* Username */}
                      <div className="flex flex-col mb-2">
                        <label className="text-sm font-semibold py-1">
                          Username
                        </label>
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
                            {
                              (updateProfileInfoError as any)?.response?.data
                                ?.message
                            }
                          </span>
                        )}
                      </div>

                      {/* About */}
                      <div className="flex flex-col mb-2">
                        <label className="text-sm font-semibold py-1">
                          About
                        </label>
                        <Textarea
                          className="text-xs border rounded px-2 py-1 focus-visible:border-[#615EF0] focus-visible:ring-0"
                          rows={3}
                          value={editData.about}
                          onChange={(e) =>
                            setEditData({ ...editData, about: e.target.value })
                          }
                        />
                      </div>

                      {/* Phone Number */}
                      <div className="flex flex-col mb-2">
                        <label className="text-sm font-semibold py-1">
                          Phone Number
                        </label>
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
                        <label className="text-sm font-semibold py-1">
                          Email
                        </label>
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
                  ) : (
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
                        <p className="text-xs text-gray-500">
                          {profileData.email}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            {selectedTab === 'Help' && (
              <div className="w-full px-2 text-sm text-gray-700 flex flex-col gap-4">
                <h2 className="text-lg font-semibold">Help & Support</h2>

                <div>
                  <p className="mb-2">
                    Welcome to BroChat support. If you have any questions or
                    issues using the app, check the information below or reach
                    out to our support team.
                  </p>

                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      Make sure your app is up to date for the latest features
                      and security.
                    </li>
                    <li>Your chats are encrypted and private.</li>
                    <li>
                      Having trouble logging in? Try resetting your password.
                    </li>
                    <li>
                      For technical support, email us at{' '}
                      <strong>support@brochat.app</strong>.
                    </li>
                  </ul>
                </div>

                <div className="mt-6 border-t pt-4">
                  <p className="text-xs text-gray-500">
                    © {new Date().getFullYear()} BroChat. All rights reserved.
                  </p>
                </div>

                <div className="mt-6">
                  <Button
                    variant="destructive"
                    className="w-full text-sm"
                    onClick={() => setOpenDeleteModal(true)}
                  >
                    Delete my account permanently
                  </Button>
                </div>
              </div>
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
