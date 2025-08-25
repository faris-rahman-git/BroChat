import { useEffect, useState } from 'react';
import { GroupChatType } from '@bro/shared';
import { useGetAllGroupsForm } from '@client/hooks/admin/groupManagement/logic/useGetAllGroupsForm';
import { useGroupSoftDeleteManagementForm } from '@client/hooks/admin/groupManagement/logic/useGroupSoftDeleteManagementForm';
import { useGroupBlockManagementForm } from '@client/hooks/admin/groupManagement/logic/useGroupBlockManagementForm';
import { getPageNumber } from '@client/utils/getPageNumber';

export const useAllGroupsHook = () => {
  const [groupList, setGroupList] = useState<GroupChatType[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    createdAt: '',
  });
  const [openModal, setOpenModal] = useState(false);
  const [selectedButton, setSelectedButton] = useState<'block' | 'delete' | ''>(
    ''
  );
  const [selectedGroup, setSelectedGroup] = useState<GroupChatType | null>(
    null
  );

  const { getAllGroupMutate, isPending } = useGetAllGroupsForm(
    setGroupList,
    setTotalPages
  );
  const { mutateSoftDelete } = useGroupSoftDeleteManagementForm(
    setGroupList,
    setTotalPages
  );
  const { mutateBlock } = useGroupBlockManagementForm(
    setGroupList,
    setTotalPages
  );

  useEffect(() => {
    const trimmed = searchValue.trim();

    const delay = setTimeout(() => {
      getAllGroupMutate({
        searchValue: trimmed,
        ...filters,
        page: 1,
      });
    }, 300);

    return () => clearTimeout(delay);
  }, [searchValue, filters]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    setFilters((prev) => ({
      ...prev,
      createdAt: selectedDate.toLocaleDateString('en-CA'),
    }));
  };

  const handleSearchWithFilters = () => {
    getAllGroupMutate({
      searchValue,
      ...filters,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      status: '',
      createdAt: '',
    };
    setFilters(clearedFilters);
    getAllGroupMutate({
      searchValue,
      ...clearedFilters,
      page: 1,
    });
  };

  const handleBlockGroup = (conversationId: string, isBlocked: boolean) => {
    const pagenumber = getPageNumber(currentPage, groupList.length);
    setCurrentPage(pagenumber);
    mutateBlock({
      conversationId,
      isBlocked: !isBlocked,
      searchValue,
      ...filters,
      page: pagenumber,
    });
  };

  const handleSoftDeleteUser = (conversationId: string) => {
    const pagenumber = getPageNumber(currentPage, groupList.length);
    setCurrentPage(pagenumber);
    mutateSoftDelete({
      conversationId,
      isDeleted: true,
      searchValue,
      ...filters,
      page: pagenumber,
    });
  };

  return {
    handleDateSelect,
    handleSearchWithFilters,
    handleClearFilters,
    handleBlockGroup,
    handleSoftDeleteUser,
    setSearchValue,
    totalPages,
    isPending,
    currentPage,
    filters,
    groupList,
    searchValue,
    setCurrentPage,
    setFilters,
    mutate: getAllGroupMutate,
    openModal,
    setOpenModal,
    selectedButton,
    setSelectedButton,
    selectedGroup,
    setSelectedGroup,
  };
};
