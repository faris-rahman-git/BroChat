import { getPageNumber } from '@client/utils/getPageNumber';
import { useState, useEffect } from 'react';
import { AllUsersType } from '@bro/shared';
import { useUserBlockManagementForm } from '@client/hooks/admin/userManagement/logic/useUserBlockManagementForm';
import { useGetAllUsersForm } from '@client/hooks/admin/userManagement/logic/useGetAllUsersForm';
import { useSoftDeleteUserForm } from '@client/hooks/admin/userManagement/logic/useSoftDeleteUserForm';

export const useAllUsersPanelHook = () => {
  const [userList, setUserList] = useState<AllUsersType[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedButton, setSelectedButton] = useState<'block' | 'delete' | ''>(
    ''
  );
  const [selectedUser, setSelectedUser] = useState<AllUsersType | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    joinedAt: '',
  });

  const { getAllUserMutate, isPending } = useGetAllUsersForm(
    setUserList,
    setTotalPages
  );
  const { mutateBlock } = useUserBlockManagementForm(
    setUserList,
    setTotalPages
  );
  const { mutateSoftDelete } = useSoftDeleteUserForm(
    setUserList,
    setTotalPages
  );

  useEffect(() => {
    if (searchValue.trim().length < 1) {
      getAllUserMutate({
        searchValue,
        ...filters,
        page: 1,
      });
    }
  }, [searchValue]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchValue.trim().length > 1) {
        getAllUserMutate({
          searchValue,
          ...filters,
          page: 1,
        });
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchValue]);

  const handleBlockUser = (userId: string, isBlocked: boolean) => {
    const pagenumber = getPageNumber(currentPage, userList.length);
    setCurrentPage(pagenumber);
    mutateBlock({
      userId,
      isBlocked: !isBlocked,
      searchValue,
      ...filters,
      page: pagenumber,
    });
  };

  const handleSoftDeleteUser = (userId: string) => {
    const pagenumber = getPageNumber(currentPage, userList.length);
    setCurrentPage(pagenumber);
    mutateSoftDelete({
      userId,
      searchValue,
      ...filters,
      page: pagenumber,
    });
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    setFilters((prev) => ({
      ...prev,
      joinedAt: selectedDate.toLocaleDateString('en-CA'),
    }));
  };

  const handleSearchWithFilters = () => {
    getAllUserMutate({
      searchValue,
      ...filters,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      status: '',
      joinedAt: '',
    };
    setFilters(clearedFilters);
    getAllUserMutate({
      searchValue,
      ...clearedFilters,
      page: 1,
    });
  };

  return {
    userList,
    searchValue,
    setSearchValue,
    totalPages,
    currentPage,
    setCurrentPage,
    openModal,
    setOpenModal,
    selectedButton,
    setSelectedButton,
    selectedUser,
    setSelectedUser,
    filters,
    setFilters,
    handleBlockUser,
    handleSoftDeleteUser,
    handleDateSelect,
    handleSearchWithFilters,
    handleClearFilters,
    isPending,
    mutate: getAllUserMutate,
  };
};
