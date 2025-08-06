import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { LuBan, LuMenu, LuSearch, LuTrash2 } from 'react-icons/lu';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { GroupChatType, GroupMember } from '@bro/shared';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@client/components/ui/select';
import { Calendar } from '@client/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@client/components/ui/popover';
import { Button } from '@client/components/ui/button';
import { format } from 'date-fns';
import { MdClear } from 'react-icons/md';
import DataTable from '@client/components/customUi/commonElemets/DataTable';
import ConfirmActionButton from '@client/components/customUi/commonElemets/ConfirmActionButton';
import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import { getPageNumber } from '@client/utils/getPageNumber';
import CustomModals from '@client/components/customUi/commonElemets/CustomModals';
import { useGetAllGroups } from '@client/hooks/admin/groupManagement/useGetAllGroups';
import { useGroupBlockManagement } from '@client/hooks/admin/groupManagement/useGroupBlockManagement';
import { useGroupSoftDeleteManagement } from '@client/hooks/admin/groupManagement/useGroupSoftDeleteManagement';
import GroupDetailsModalContent from '../../elements/groupElements/GroupDetailsModalContent';

function AllGroups() {
  const dispatch = useAppDispatch();
  const [groupList, setGroupList] = useState<GroupChatType[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedButton, setSelectedButton] = useState<'block' | 'delete' | ''>(
    ''
  );
  const [selectedGroup, setSelectedGroup] = useState<GroupChatType | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    createdAt: '',
  });

  //main data handler
  const { isPending, isSuccess, isError, mutate, error, data } =
    useGetAllGroups();
  useEffect(() => {
    if (isSuccess) {
      setGroupList(data.groupList);
      setTotalPages(data.totalPages);
    }
  }, [isSuccess]);
  useEffect(() => {
    if (isError) {
      console.log(error.message);
    }
  }, [isError]);
  useEffect(() => {
    const trimmed = searchValue.trim();

    const delay = setTimeout(() => {
      mutate({
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
    mutate({
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
    mutate({
      searchValue,
      ...clearedFilters,
      page: 1,
    });
  };

  // group block handler
  const {
    isPending: isPendingBlock,
    isError: isErrorBlock,
    mutate: mutateBlock,
    isSuccess: isSuccessBlock,
    error: errorBlock,
    data: dataBlock,
  } = useGroupBlockManagement();
  useEffect(() => {
    if (isSuccessBlock) {
      setGroupList(dataBlock.updatedGroupList);
      setTotalPages(dataBlock.totalPages);
    }
  }, [isSuccessBlock]);
  useEffect(() => {
    if (isErrorBlock) {
      console.log(errorBlock.message);
    }
  }, [isErrorBlock]);
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

  // group softdelete handler
  const {
    isPending: isPendingSoftDelete,
    isError: isErrorSoftDelete,
    mutate: mutateSoftDelete,
    isSuccess: isSuccessSoftDelete,
    error: errorSoftDelete,
    data: dataSoftDelete,
  } = useGroupSoftDeleteManagement();
  useEffect(() => {
    if (isSuccessSoftDelete) {
      setGroupList(dataSoftDelete.updatedGroupList);
      setTotalPages(dataSoftDelete.totalPages);
    }
  }, [isSuccessSoftDelete]);
  useEffect(() => {
    if (isErrorSoftDelete) {
      console.log(errorSoftDelete.message);
    }
  }, [isErrorSoftDelete]);
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

  //common pending handler
  useEffect(() => {
    const anyPending = isPendingBlock || isPendingSoftDelete;
    dispatch(anyPending ? showLoader() : hideLoader());
  }, [isPendingBlock, isPendingSoftDelete]);

  const columnHelper = createColumnHelper<GroupChatType>();
  const columns = [
    {
      header: '#',
      cell: (info: CellContext<GroupChatType, unknown>) => {
        return <span>{info.row.index + 1 + (currentPage - 1) * 10}</span>;
      },
    },
    columnHelper.accessor('groupName', { header: 'Group Name' }),
    columnHelper.accessor('createdBy.name', { header: 'Created By' }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      cell: (info: CellContext<GroupChatType, unknown>) => {
        const date = new Date(info.getValue() as string);
        const formatted = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
        return <span>{formatted}</span>;
      },
    }),
    columnHelper.accessor('participants', {
      header: 'Member Count',
      cell: (info: CellContext<GroupChatType, unknown>) => {
        const data = info.getValue() as GroupMember[];
        const count = data.length;
        return <span>{count}</span>;
      },
    }),
    {
      header: 'Status',
      cell: (info: CellContext<GroupChatType, unknown>) => {
        const rowData = info.row.original;
        const isBlocked = rowData.isBlocked;

        return (
          <div className="flex justify-center">
            <div
              className={`px-4 py-[6px] text-xs font-semibold rounded-full w-[75px] flex items-center justify-center text-white
          ${isBlocked ? 'bg-[#FF5C5C] ' : 'bg-[#54CA68]'}`}
            >
              {isBlocked ? 'Blocked' : 'Active'}
            </div>
          </div>
        );
      },
    },
    {
      header: 'Type',
      cell: (info: CellContext<GroupChatType, unknown>) => {
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
      cell: (info: CellContext<GroupChatType, unknown>) => {
        const rowData = info.row.original;

        return (
          <div className="flex gap-4 justify-center items-center">
            {/* Block Button */}
            <ButtonIcon
              Icon={LuBan}
              label={rowData.isBlocked ? 'Unblock' : 'Block'}
              className={`justify-start ps-[9px] ${
                rowData.isBlocked
                  ? 'bg-[#54CA68] hover:bg-[#41C457]'
                  : 'bg-[#FF5C5C] hover:bg-[#FF4848]'
              }`}
              iconClassName="text-white"
              onClick={() => {
                setSelectedGroup(rowData);
                setSelectedButton('block');
                setOpenModal(true);
              }}
            />

            {/* Delete Button */}
            <ButtonIcon
              Icon={LuTrash2}
              label="Delete"
              className="justify-start ps-[9px] bg-red-700 hover:bg-red-800"
              iconClassName="text-white"
              onClick={() => {
                setSelectedGroup(rowData);
                setSelectedButton('delete');
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

          if (selectedButton === 'block') {
            handleBlockGroup(conversationId, selectedGroup.isBlocked);
          } else if (selectedButton === 'delete') {
            handleSoftDeleteUser(conversationId);
          }
        }}
        title={
          selectedButton === 'block'
            ? selectedGroup.isBlocked
              ? 'Unblock Group'
              : 'Block Group'
            : 'Delete Group'
        }
        description={
          selectedButton === 'block'
            ? `Confirm that you want to ${
                selectedGroup?.isBlocked ? 'unblock' : 'block'
              } this Group. This action can be undone.`
            : 'Confirm that you want to delete this Group. This action can be undone.'
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
      tableHeader="All Groups"
      totalPages={totalPages}
      onPageChange={(page) => {
        setCurrentPage(page);
        mutate({ searchValue, ...filters, page });
      }}
    >
      <div className="flex gap-2">
        <div className="text-sm font-medium text-center flex items-center">
          <span>Filter By:</span>
        </div>
        <Select
          value={filters.status}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, status: value }))
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[150px] justify-start text-left font-normal"
            >
              {filters.createdAt ? (
                format(new Date(filters.createdAt), 'dd MMM yyyy')
              ) : (
                <span className="text-muted-foreground">Created At</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={
                filters.createdAt ? new Date(filters.createdAt) : undefined
              }
              onSelect={handleDateSelect}
              disabled={(date) => date > new Date()}
            />
          </PopoverContent>
        </Popover>
        <ButtonIcon
          Icon={LuSearch}
          label={'Search'}
          className={`text-white  flex justify-center items-center bg-blue-800 hover:bg-blue-900 hover:text-white px-4 py-[6px]`}
          onClick={handleSearchWithFilters}
        ></ButtonIcon>
        <ButtonIcon
          Icon={MdClear}
          label={'Search'}
          className={`text-white flex justify-center items-center bg-red-600 hover:bg-red-700 hover:text-white px-4 py-[6px]`}
          onClick={handleClearFilters}
        ></ButtonIcon>
      </div>
      {renderModal()}
    </DataTable>
  );
}

export default AllGroups;
