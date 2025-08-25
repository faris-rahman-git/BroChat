import { useEffect, useState } from 'react';
import { AllUsersType } from '@bro/shared';
import { useGetDeletedUsersForm } from '@client/hooks/admin/userManagement/logic/useGetDeletedUsersForm';
import { useRestoreUserForm } from '@client/hooks/admin/userManagement/logic/useRestoreUserForm';
import { useHardDeleteUserHook } from '@client/hooks/admin/userManagement/logic/useHardDeleteUserHook';
import { getPageNumber } from '@client/utils/getPageNumber';

export const useDeletedUsersPanelHook = () => {
  const [userList, setUserList] = useState<AllUsersType[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchValue, setSearchValue] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const { getDeleteUsersMutate, isPending } = useGetDeletedUsersForm(
    setUserList,
    setTotalPages
  );
  const { mutateRestore } = useRestoreUserForm(setUserList, setTotalPages);
  const { mutateHardDelete } = useHardDeleteUserHook(
    setUserList,
    setTotalPages
  );

  useEffect(() => {
    if (searchValue.trim().length < 1) {
      getDeleteUsersMutate({
        searchValue,
        page: 1,
      });
    }
  }, [searchValue]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchValue.trim().length > 1) {
        getDeleteUsersMutate({
          searchValue,
          page: 1,
        });
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchValue]);

  const handleRestoreUser = (userId: string) => {
    const pagenumber = getPageNumber(currentPage, userList.length);
    setCurrentPage(pagenumber);
    mutateRestore({
      userId,
      searchValue,
      page: pagenumber,
    });
  };

  const handleHardDeleteUser = (userId: string) => {
    const pagenumber = getPageNumber(currentPage, userList.length);
    setCurrentPage(pagenumber);
    mutateHardDelete({
      userId,
      searchValue,
      page: pagenumber,
    });
  };

  return {
    handleRestoreUser,
    handleHardDeleteUser,
    userList,
    totalPages,
    searchValue,
    setSearchValue,
    currentPage,
    setCurrentPage,
    isPending,
    mutate: getDeleteUsersMutate,
  };
};
