import { getPageNumber } from '@client/utils/getPageNumber';
import { useState, useEffect } from 'react';
import { DeleteGroupsReturnType, GroupChatType } from '@bro/shared';
import { useGetDeletedGroupsForm } from '@client/hooks/admin/groupManagement/logic/useGetDeletedGroupsForm';
import { useHardDeleteGroupForm } from '@client/hooks/admin/groupManagement/logic/useHardDeleteGroupForm';
import { useGroupSoftDeleteManagementForm } from '@client/hooks/admin/groupManagement/logic/useGroupSoftDeleteManagementForm';

export const useGetDeletedGroupsHook = () => {
  const [groupList, setGroupList] = useState<DeleteGroupsReturnType[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchValue, setSearchValue] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedButton, setSelectedButton] = useState<
    'restore' | 'hardDelete' | ''
  >('');
  const [selectedGroup, setSelectedGroup] = useState<GroupChatType | null>(
    null
  );

  const { getDeleteGroup, isPending } = useGetDeletedGroupsForm(
    setGroupList,
    setTotalPages
  );
  const { mutateHardDelete } = useHardDeleteGroupForm(
    setGroupList,
    setTotalPages
  );
  const { mutateSoftDelete } = useGroupSoftDeleteManagementForm(
    setGroupList,
    setTotalPages
  );

  useEffect(() => {
    const trimmed = searchValue.trim();

    const delay = setTimeout(() => {
      getDeleteGroup({
        searchValue: trimmed,
        page: 1,
      });
    }, 300);

    return () => clearTimeout(delay);
  }, [searchValue]);

  const handleRestoreUser = (conversationId: string) => {
    const pagenumber = getPageNumber(currentPage, groupList.length);
    setCurrentPage(pagenumber);
    mutateSoftDelete({
      conversationId,
      isDeleted: false,
      searchValue,
      createdAt: '',
      status: '',
      page: pagenumber,
    });
  };

  const handleHardDeleteUser = (conversationId: string) => {
    const pagenumber = getPageNumber(currentPage, groupList.length);
    setCurrentPage(pagenumber);
    mutateHardDelete({
      conversationId,
      searchValue,
      page: pagenumber,
    });
  };

  return {
    handleRestoreUser,
    handleHardDeleteUser,
    groupList,
    totalPages,
    searchValue,
    setSearchValue,
    currentPage,
    setCurrentPage,
    isPending,
    mutate: getDeleteGroup,
    openModal,
    setOpenModal,
    selectedButton,
    setSelectedButton,
    selectedGroup,
    setSelectedGroup,
  };
};
