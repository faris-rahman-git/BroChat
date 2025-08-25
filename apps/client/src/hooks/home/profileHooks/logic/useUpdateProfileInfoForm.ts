import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { useEffect } from 'react';
import { useUpdateProfileInfo } from '../api/useUpdateProfileInfo';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { updateProfileInfo } from '@client/redux/features/userSlices/authSlices/userSlice';
import { UseMutateFunction } from '@tanstack/react-query';
import { ProfileUpdateInfoParams } from '@bro/shared';

export const useUpdateProfileInfoForm = (
  deleteMutate: UseMutateFunction<void, Error, string, unknown>,
  profileData: ProfileUpdateInfoParams,
  newMediaUrl: string | null,
  editData: ProfileUpdateInfoParams,
  setNewMediaUrl: React.Dispatch<React.SetStateAction<string | null>>,
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>,
  setProfileData: React.Dispatch<React.SetStateAction<ProfileUpdateInfoParams>>
) => {
  const dispatch = useAppDispatch();

  const { mutate, isPending, isError, error, isSuccess } =
    useUpdateProfileInfo();

  useEffect(() => {
    if (isError) {
      if (
        newMediaUrl &&
        newMediaUrl != '' &&
        newMediaUrl != profileData.avatar
      ) {
        deleteMutate(newMediaUrl);
      }
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      const updatedData = {
        ...editData,
        avatar: newMediaUrl !== null ? newMediaUrl : '',
      };

      setNewMediaUrl(null);
      setIsEditing(false);
      setProfileData(editData);
      dispatch(updateProfileInfo({ profileData: updatedData }));
    }
  }, [isSuccess]);

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  return {
    updateProfileInfoMutate: mutate,
    updateProfileInfoError: error,
    updateProfileInfoIsError: isError,
  };
};
