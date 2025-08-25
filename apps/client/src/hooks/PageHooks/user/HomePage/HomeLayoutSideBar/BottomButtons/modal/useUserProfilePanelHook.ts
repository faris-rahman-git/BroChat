import { UserReduxType } from '@client/types/ReduxTypes';
import { useEffect, useRef, useState } from 'react';
import { ProfileUpdateInfoParams } from '@bro/shared';
import { TransactionsArrayType } from '@client/types/profileType/TransactionsType';
import { useUpdateProfileInfoForm } from '@client/hooks/home/profileHooks/logic/useUpdateProfileInfoForm';
import { useMutation } from '@tanstack/react-query';
import {
  deleteFileApi,
  uploadFileApi,
} from '@client/services/home/commonServices';
import { useDeleteAccountForm } from '@client/hooks/home/profileHooks/logic/useDeleteAccountForm';
import { useGetAllTransactionForm } from '@client/hooks/home/profileHooks/logic/useGetAllTransactionForm';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';

export const useUserProfilePanelHook = (
  userDetails: UserReduxType,
  onClose: () => void,
  logOut: () => void
) => {
  const dispatch = useAppDispatch();

  const [selectedTab, setSelectedTab] = useState('Profile');
  const panelRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileUpdateInfoParams>({
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
  const [transactions, setTransactions] = useState<TransactionsArrayType>({
    list: [],
    totalCount: 0,
    totalAmount: 0,
  });

  const { getTransMutate } = useGetAllTransactionForm(setTransactions);

  useEffect(() => {
    getTransMutate();
  }, []);

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

  const { mutate: deleteMutate, isPending: deleteIsPending } = useMutation({
    mutationFn: deleteFileApi,
    onError: (err) => {
      console.error('Upload error:', err.message);
    },
  });

  const {
    updateProfileInfoMutate,
    updateProfileInfoError,
    updateProfileInfoIsError,
  } = useUpdateProfileInfoForm(
    deleteMutate,
    profileData,
    newMediaUrl,
    editData,
    setNewMediaUrl,
    setIsEditing,
    setProfileData
  );

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
  const { deleteAccountMutate } = useDeleteAccountForm(logOut);

  const handleDeleteAccount = () => {
    deleteAccountMutate();
  };

  useEffect(() => {
    const isPending = deleteIsPending || uploadIsPending;
    dispatch(isPending ? showLoader() : hideLoader());
  }, [deleteIsPending, uploadIsPending]);

  return {
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
  };
};
