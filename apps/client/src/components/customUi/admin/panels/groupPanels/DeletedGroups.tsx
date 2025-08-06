import { CellContext, createColumnHelper } from '@tanstack/react-table';
import DataTable from '../../../commonElemets/DataTable';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { DeleteGroupsReturnType, GroupChatType } from '@bro/shared';
import { MdOutlineDeleteForever, MdOutlineRestore } from 'react-icons/md';
import { getPageNumber } from '@client/utils/getPageNumber';
import { useGetDeletedGroups } from '@client/hooks/admin/groupManagement/useGetDeletedGroups';
import CustomModals from '@client/components/customUi/commonElemets/CustomModals';
import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import ConfirmActionButton from '@client/components/customUi/commonElemets/ConfirmActionButton';
import GroupDetailsModalContent from '../../elements/groupElements/GroupDetailsModalContent';
import { LuMenu } from 'react-icons/lu';
import { useGroupSoftDeleteManagement } from '@client/hooks/admin/groupManagement/useGroupSoftDeleteManagement';
import { useHardDeleteGroup } from '@client/hooks/admin/groupManagement/useHardDeleteGroup';

function DeletedGroups() {
  const dispatch = useAppDispatch();
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

  const { isPending, isSuccess, isError, mutate, error, data } =
    useGetDeletedGroups();
  useEffect(() => {
    if (isSuccess) {
      setGroupList(data.groupList);
      setTotalPages(data.totalPages);
    }
  }, [isSuccess]);
  useEffect(() => {
    if (isError && error?.message) {
      console.log(error.message);
    }
  }, [isError, error]);
  useEffect(() => {
    const trimmed = searchValue.trim();

    const delay = setTimeout(() => {
      mutate({
        searchValue: trimmed,
        page: 1,
      });
    }, 300);

    return () => clearTimeout(delay);
  }, [searchValue]);

  const {
    isPending: isPendingRestore,
    isError: isErrorRestore,
    mutate: mutateRestore,
    isSuccess: isSuccessRestore,
    error: errorRestore,
    data: dataRestore,
  } = useGroupSoftDeleteManagement();
  useEffect(() => {
    if (isSuccessRestore) {
      setGroupList(dataRestore.updatedGroupList);
      setTotalPages(dataRestore.totalPages);
    }
  }, [isSuccessRestore]);
  useEffect(() => {
    if (isErrorRestore) {
      console.log(errorRestore.message);
    }
  }, [isErrorRestore]);
  const handleRestoreUser = (conversationId: string) => {
    const pagenumber = getPageNumber(currentPage, groupList.length);
    setCurrentPage(pagenumber);
    mutateRestore({
      conversationId,
      isDeleted: false,
      searchValue,
      createdAt: '',
      status: '',
      page: pagenumber,
    });
  };

  const {
    isPending: isPendingHardDelete,
    isError: isErrorHardDelete,
    mutate: mutateHardDelete,
    isSuccess: isSuccessHardDelete,
    error: errorHardDelete,
    data: dataHardDelete,
  } = useHardDeleteGroup();
  useEffect(() => {
    if (isSuccessHardDelete) {
      setGroupList(dataHardDelete.updatedGroupList);
      setTotalPages(dataHardDelete.totalPages);
    }
  }, [isSuccessHardDelete]);
  useEffect(() => {
    if (isErrorHardDelete) {
      console.log(errorHardDelete.message);
    }
  }, [isErrorHardDelete]);
  const handleHardDeleteUser = (conversationId: string) => {
    const pagenumber = getPageNumber(currentPage, groupList.length);
    setCurrentPage(pagenumber);
    mutateHardDelete({
      conversationId,
      searchValue,
      page: pagenumber,
    });
  };

  //common pending loader
  useEffect(() => {
    const anyPending = isPendingRestore || isPendingHardDelete;
    dispatch(anyPending ? showLoader() : hideLoader());
  }, [isPendingRestore, isPendingHardDelete]);

  const columnHelper = createColumnHelper<DeleteGroupsReturnType>();

  const columns = [
    {
      header: '#',
      cell: (info: CellContext<DeleteGroupsReturnType, unknown>) => {
        return <span>{info.row.index + 1 + (currentPage - 1) * 10}</span>;
      },
    },
    columnHelper.accessor('groupName', { header: 'Group Name' }),
    columnHelper.accessor('createdBy.name', { header: 'Created By' }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      cell: (info: CellContext<DeleteGroupsReturnType, unknown>) => {
        const date = new Date(info.getValue() as string);
        const formatted = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
        return <span>{formatted}</span>;
      },
    }),
    columnHelper.accessor('deletedAt', {
      header: 'Deleted At',
      cell: (info: CellContext<DeleteGroupsReturnType, unknown>) => {
        const date = new Date(info.getValue() as string);
        const formatted = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
        return <span>{formatted}</span>;
      },
    }),
    {
      header: 'Type',
      cell: (info: CellContext<DeleteGroupsReturnType, unknown>) => {
        const rowData = info.row.original;
        const isPaid = rowData.isPaid;

        return (
          <div className="flex justify-center">
            <div
              className={`px-4 py-[6px] text-xs font-semibold rounded-full w-[75px] flex items-center justify-center text-white
${isPaid ? 'bg-red-900' : 'bg-sky-500'}
`}
            >
              {isPaid ? 'Premium' : 'Free'}
            </div>
          </div>
        );
      },
    },
    {
      header: 'Actions',
      cell: (info: CellContext<DeleteGroupsReturnType, unknown>) => {
        const rowData = info.row.original;

        return (
          <div className="flex gap-4 justify-center items-center">
            {/* restore Button */}
            <ButtonIcon
              Icon={MdOutlineRestore}
              label={'Restore'}
              className={`justify-start ps-[9px] bg-green-700 hover:bg-green-800`}
              iconClassName="text-white"
              onClick={() => {
                setSelectedGroup(rowData);
                setSelectedButton('restore');
                setOpenModal(true);
              }}
            />

            {/* hardDelete Button */}
            <ButtonIcon
              Icon={MdOutlineDeleteForever}
              label="Delete"
              className="justify-start ps-[9px] bg-red-800 hover:bg-red-900"
              iconClassName="text-white"
              onClick={() => {
                setSelectedGroup(rowData);
                setSelectedButton('hardDelete');
                setOpenModal(true);
              }}
            />

            <ConfirmActionButton
              buttonIcon={LuMenu}
              buttonClassName={`bg-blue-700 hover:bg-blue-800`}
              buttonContent="Details"
              modalTitle={`User Details`}
              dialogClassName="sm:max-w-[700px]"
              isConfirmButtonDisabled={true}
              onConfirm={() => {}}
            >
              <GroupDetailsModalContent group={rowData} />
            </ConfirmActionButton>
          </div>
        );
      },
    },
  ];

  const renderModal = () => {
    if (!selectedGroup) return null;

    return (
      <CustomModals
        open={openModal}
        onOpenChange={(val) => {
          if (!val) setSelectedGroup(null);
          setOpenModal(val);
        }}
        onConfirm={() => {
          if (!selectedGroup) return;
          const conversationId = selectedGroup._id as string;
          const pagenumber = getPageNumber(currentPage, groupList.length);
          setCurrentPage(pagenumber);

          if (selectedButton === 'restore') {
            handleRestoreUser(conversationId);
          } else if (selectedButton === 'hardDelete') {
            handleHardDeleteUser(conversationId);
          }
        }}
        title={
          selectedButton === 'restore'
            ? 'Restore Group'
            : 'Permanently Delete Group'
        }
        description={
          selectedButton === 'restore'
            ? `Confirm that you want to Restore this Group. This action can be undone.`
            : 'Confirm that you want to Permanently Delete this Group. This action cannot be undone.'
        }
        confirmText="Confirm"
      />
    );
  };

  return (
    <DataTable
      columns={columns}
      data={groupList}
      setSearchValue={setSearchValue}
      searchValue={searchValue}
      isPending={isPending}
      tableHeader="All Deleted Groups"
      totalPages={totalPages}
      onPageChange={(page) => {
        setCurrentPage(page);
        mutate({ searchValue, page });
      }}
    >
      {renderModal()}
    </DataTable>
  );
}

export default DeletedGroups;
