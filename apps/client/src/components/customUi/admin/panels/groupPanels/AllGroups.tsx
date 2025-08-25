import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { LuSearch } from 'react-icons/lu';
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
import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import ActionsElement from '../../elements/groupElements/ActionsElement';
import RenderModal from '../../elements/groupElements/RenderModal';
import { useAllGroupsHook } from '@client/hooks/PageHooks/admin/group/useAllGroupsHook';

function AllGroups() {
  const {
    handleBlockGroup,
    handleClearFilters,
    handleDateSelect,
    handleSearchWithFilters,
    handleSoftDeleteUser,
    isPending,
    currentPage,
    filters,
    groupList,
    searchValue,
    setSearchValue,
    totalPages,
    setCurrentPage,
    setFilters,
    mutate,
    openModal,
    setOpenModal,
    selectedButton,
    setSelectedButton,
    selectedGroup,
    setSelectedGroup,
  } = useAllGroupsHook();

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
          <ActionsElement
            rowData={rowData}
            setOpenModal={setOpenModal}
            setSelectedButton={setSelectedButton}
            setSelectedGroup={setSelectedGroup}
          />
        );
      },
    },
  ];

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
      <RenderModal
        currentPage={currentPage}
        groupList={groupList}
        handleSoftDeleteUser={handleSoftDeleteUser}
        handleBlockGroup={handleBlockGroup}
        openModal={openModal}
        selectedButton={selectedButton}
        selectedGroup={selectedGroup}
        setCurrentPage={setCurrentPage}
        setOpenModal={setOpenModal}
        setSelectedGroup={setSelectedGroup}
      />{' '}
    </DataTable>
  );
}

export default AllGroups;
