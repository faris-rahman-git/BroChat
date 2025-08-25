import { CellContext, createColumnHelper } from '@tanstack/react-table';
import DataTable from '../../../commonElemets/DataTable';
import { DeleteGroupsReturnType } from '@bro/shared';
import { MdOutlineDeleteForever, MdOutlineRestore } from 'react-icons/md';
import { getPageNumber } from '@client/utils/getPageNumber';
import CustomModals from '@client/components/customUi/commonElemets/CustomModals';
import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import ConfirmActionButton from '@client/components/customUi/commonElemets/ConfirmActionButton';
import GroupDetailsModalContent from '../../elements/groupElements/GroupDetailsModalContent';
import { LuMenu } from 'react-icons/lu';
import { useGetDeletedGroupsHook } from '@client/hooks/PageHooks/admin/group/useGetDeletedGroupsHook';

function DeletedGroups() {
  const {
    currentPage,
    groupList,
    handleHardDeleteUser,
    handleRestoreUser,
    isPending,
    searchValue,
    setCurrentPage,
    setSearchValue,
    totalPages,
    mutate,
    openModal,
    setOpenModal,
    selectedButton,
    setSelectedButton,
    selectedGroup,
    setSelectedGroup,
  } = useGetDeletedGroupsHook();

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
