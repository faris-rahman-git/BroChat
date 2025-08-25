import React, { useEffect, useRef, useState } from 'react';
import { GroupFixedData, SearchResultType } from '@bro/shared';
import { searchUserHelper } from '@client/utils/searchUserHelper';
import { useMutation } from '@tanstack/react-query';
import { uploadFileApi } from '@client/services/home/commonServices';
import { useCreateNewGroupForm } from '@client/hooks/home/groupHooks/logic/useCreateNewGroupForm';
import {
  hideLoader,
  showLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';

export const useCreateNewGroupHook = (
  setActiveTab: React.Dispatch<React.SetStateAction<string>>,
  oneToOneChatListData: SearchResultType[]
) => {
  const dispatch = useAppDispatch();
  const [searchResult, setSearchResult] = useState<SearchResultType[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<SearchResultType[]>([]);
  const [groupName, setGroupName] = useState('');
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [groupAvatarFile, setGroupAvatarFile] = useState<File | null>(null);
  const [groupAvatarPreview, setGroupAvatarPreview] = useState<string | null>(
    null
  );

  useEffect(() => {
    const result = searchUserHelper(oneToOneChatListData, '');
    setSearchResult(result);
  }, [oneToOneChatListData]);

  const { mutate: uploadMutate, isPending: uploadIsPending } = useMutation({
    mutationFn: uploadFileApi,
    onSuccess: (mediaUrl) => {
      createGroup(groupName, selectedUsers, mediaUrl);
    },
    onError: (err) => {
      console.error('Upload error:', err.message);
    },
  });

  const { newMutate } = useCreateNewGroupForm(setActiveTab);

  useEffect(() => {
    dispatch(uploadIsPending ? showLoader() : hideLoader());
  }, [uploadIsPending]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = searchUserHelper(oneToOneChatListData, e.target.value);
    setSearchResult(result);
  };

  const toggleUserSelection = (user: SearchResultType) => {
    setSelectedUsers((prev) => {
      const alreadySelected = prev.find(
        (u) => u.receiverId === user.receiverId
      );

      if (alreadySelected) {
        return prev.filter((u) => u.receiverId !== user.receiverId);
      } else {
        const totalCount = prev.length + 1; // newly added user
        if (totalCount + 1 > GroupFixedData.Member_limit) {
          return prev;
        }
        return [...prev, user];
      }
    });
  };

  const isSelected = (id: string) =>
    selectedUsers.some((user) => user.receiverId === id);

  const resetGroupCreation = () => {
    setSelectedUsers([]);
    setGroupName('');
    setStep(1);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGroupAvatarFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setGroupAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateGroup = () => {
    if (groupName.trim() === '') return;
    if (groupAvatarFile) {
      uploadMutate({
        file: groupAvatarFile,
        fileType: 'image',
        extension: 'png',
      });
    } else {
      createGroup(groupName, selectedUsers, '');
    }
  };

  const createGroup = (
    groupName: string,
    members: SearchResultType[],
    groupAvatarUrl: string
  ) => {
    const groupMembers = members.map((user) => user.receiverId);
    newMutate({ groupName, groupMembers, groupAvatarUrl });
  };

  return {
    searchResult,
    selectedUsers,
    groupName,
    step,
    fileInputRef,
    groupAvatarPreview,
    handleSearch,
    toggleUserSelection,
    isSelected,
    resetGroupCreation,
    handleAvatarChange,
    handleCreateGroup,
    setStep,
    setGroupAvatarPreview,
    setGroupName
  }
};
