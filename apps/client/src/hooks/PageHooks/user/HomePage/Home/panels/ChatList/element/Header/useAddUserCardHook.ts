import { useSearchUserForm } from '@client/hooks/home/dmHooks/logic/useSearchUserForm';
import React, { useEffect, useState } from 'react';
import { SearchResultType } from '@bro/shared';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { setActiveReceiver } from '@client/redux/features/userSlices/homeSlices/commonSlices/activeReceiverSlice';

export const useAddUserCardHook = (
  setActiveTab: React.Dispatch<React.SetStateAction<string>>
) => {
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResultType[]>([]);
  const [searchError, setSearchError] = useState('No User Found');

  const { mutate ,isPending } = useSearchUserForm(setSearchResult, setSearchError);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchValue.trim().length > 1) {
        mutate({ searchData: searchValue });
      }
    }, 300); // debounce

    return () => clearTimeout(delay);
  }, [searchValue]);

  const handleAddUser = (receiverAndChatDetails: SearchResultType) => {
    dispatch(setActiveReceiver({ receiver: receiverAndChatDetails }));
    setActiveTab('');
  };

  return {
    handleAddUser,
    setSearchValue,
    searchError,
    searchResult,
    searchValue ,
    isPending
  };
};
