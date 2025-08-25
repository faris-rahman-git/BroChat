import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { LuBan, LuMenu, LuSearch, LuTrash2 } from 'react-icons/lu';
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
import DetailsModalContent from '../../elements/userElemets/DetailsModalContent';
import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import { getPageNumber } from '@client/utils/getPageNumber';
import CustomModals from '@client/components/customUi/commonElemets/CustomModals';
import { AllUsersType } from '@bro/shared';
import { useAllUsersPanelHook } from '@client/hooks/PageHooks/admin/user/useAllUsersPanelHook';

function AllUsersPanel() {
  const {
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
    mutate,
  } = useAllUsersPanelHook();

  const columnHelper = createColumnHelper<AllUsersType>();
  const columns = [
    {
      header: '#',
      cell: (info: CellContext<AllUsersType, unknown>) => {
        return <span>{info.row.index + 1 + (currentPage - 1) * 10}</span>;
      },
    },
    columnHelper.accessor('username', { header: 'User Name' }),
    columnHelper.accessor('email', { header: 'Email' }),
    columnHelper.accessor('createdAt', {
      header: 'Joined At',
      cell: (info: CellContext<AllUsersType, unknown>) => {
        const date = new Date(info.getValue() as string);
        const formatted = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
        return <span>{formatted}</span>; // e.g., 17 Jun 2025
      },
    }),
    {
      header: 'Status',
      cell: (info: CellContext<AllUsersType, unknown>) => {
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
      header: 'Subscription',
      cell: (info: CellContext<AllUsersType, unknown>) => {
        const rowData = info.row.original;
        const isSubscribed = rowData.isSubscribed;

        return (
          <div className="flex justify-center">
            <div
              className={`px-4 py-[6px] text-xs font-semibold rounded-full w-[75px] flex items-center justify-center text-white
${isSubscribed ? 'bg-red-900' : 'bg-sky-500'}
`}
            >
              {isSubscribed ? 'Premium' : 'Free'}
            </div>
          </div>
        );
      },
    },
    {
      header: 'Actions',
      cell: (info: CellContext<AllUsersType, unknown>) => {
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
                setSelectedUser(rowData);
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
                setSelectedUser(rowData);
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
              <DetailsModalContent rowData={rowData} />
            </ConfirmActionButton>
          </div>
        );
      },
    },
  ];

  const renderModal = () => {
    if (!selectedUser) return null;

    return (
      <CustomModals
        open={openModal}
        onOpenChange={(val) => {
          if (!val) setSelectedUser(null);
          setOpenModal(val);
        }}
        onConfirm={() => {
          if (!selectedUser) return;
          const userId = selectedUser._id as string;
          const pagenumber = getPageNumber(currentPage, userList.length);
          setCurrentPage(pagenumber);

          if (selectedButton === 'block') {
            handleBlockUser(userId, selectedUser.isBlocked);
          } else if (selectedButton === 'delete') {
            handleSoftDeleteUser(userId);
          }
        }}
        title={
          selectedButton === 'block'
            ? selectedUser.isBlocked
              ? 'Unblock User'
              : 'Block User'
            : 'Delete User'
        }
        description={
          selectedButton === 'block'
            ? `Confirm that you want to ${
                selectedUser?.isBlocked ? 'unblock' : 'block'
              } this user. This action can be undone.`
            : 'Confirm that you want to delete this user. This action can be undone.'
        }
        confirmText="Confirm"
      />
    );
  };

  return (
    <DataTable
      columns={columns}
      data={userList}
      setSearchValue={setSearchValue}
      searchValue={searchValue}
      isPending={isPending}
      tableHeader="All Users"
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
              {filters.joinedAt ? (
                format(new Date(filters.joinedAt), 'dd MMM yyyy')
              ) : (
                <span className="text-muted-foreground">Joined At</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={
                filters.joinedAt ? new Date(filters.joinedAt) : undefined
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

export default AllUsersPanel;
