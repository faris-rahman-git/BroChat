import { useEffect } from 'react';
import { useSearchUser } from '../api/useSearchUser';
import { SearchResultType } from '@bro/shared';

export const useSearchUserForm = (
  setSearchResult: React.Dispatch<React.SetStateAction<SearchResultType[]>>,
  setSearchError: React.Dispatch<React.SetStateAction<string>>
) => {
  const { mutate, isPending, isSuccess, isError, data, error } =
    useSearchUser();

  useEffect(() => {
    if (isSuccess) {
      setSearchResult(data.MatchedUsers);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setSearchResult([]);
      setSearchError(error.message);
    } else {
      setSearchError('No User Found');
    }
  }, [isError, error]);

  useEffect(() => {
    if (isPending) {
      setSearchResult([]);
    }
  }, [isPending]);

  return {
    mutate,
    isPending
  };
};
