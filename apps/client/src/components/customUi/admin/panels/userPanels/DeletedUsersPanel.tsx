import { CellContext, createColumnHelper } from '@tanstack/react-table';
import DataTable from '../../../commonElemets/DataTable';
import ConfirmActionButton from '../../../commonElemets/ConfirmActionButton';
import { AllUsersType } from '@bro/shared';
import { MdOutlineDeleteForever, MdOutlineRestore } from 'react-icons/md';
import { LuMenu } from 'react-icons/lu';
import DetailsModalContent from '../../elements/userElemets/DetailsModalContent';
import { useDeletedUsersPanelHook } from '@client/hooks/PageHooks/admin/user/useDeletedUsersPanelHook';

function DeletedUsersPanel() {
  const {
    handleRestoreUser,
    handleHardDeleteUser,
    userList,
    totalPages,
    searchValue,
    setSearchValue,
    currentPage,
    setCurrentPage,
    isPending,
    mutate,
  } = useDeletedUsersPanelHook();

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
        return <span>{formatted}</span>;
      },
    }),
    columnHelper.accessor('deletedAt', {
      header: 'Deleted At',
      cell: (info: CellContext<AllUsersType, unknown>) => {
        const date = new Date(info.getValue() as string);
        const formatted = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
        return <span>{formatted}</span>;
      },
    }),
    columnHelper.accessor('deletedBy', {
      header: 'Deleted By',
      cell: (info) => {
        const value = info.getValue() as string;
        const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
        return <span>{capitalized}</span>;
      },
    }),
    {
      header: 'Actions',
      cell: (info: CellContext<AllUsersType, unknown>) => {
        return (
          <div className="flex gap-4 justify-center items-center">
            <ConfirmActionButton
              buttonIcon={MdOutlineRestore}
              buttonClassName="bg-[#41C457] hover:bg-[#54CA68]"
              buttonContent="Restore"
              modalTitle="Confirm Restore"
              modalDescription="Confirm that you want to restore this user. This action can be undone."
              onConfirm={() =>
                handleRestoreUser(info.row.original._id as string)
              }
            />

            <ConfirmActionButton
              buttonIcon={MdOutlineDeleteForever}
              buttonClassName={`bg-red-700 hover:bg-red-800`}
              buttonContent="Delete"
              modalTitle={`Confirm Delete`}
              modalDescription="Confirm that you want to delete this user. This action can be undone."
              onConfirm={() =>
                handleHardDeleteUser(info.row.original._id as string)
              }
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
              <DetailsModalContent rowData={info.row.original} />
            </ConfirmActionButton>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={userList}
      setSearchValue={setSearchValue}
      searchValue={searchValue}
      isPending={isPending}
      tableHeader="Deleted Users"
      totalPages={totalPages}
      onPageChange={(page) => {
        setCurrentPage(page);
        mutate({ searchValue, page });
      }}
    />
  );
}

export default DeletedUsersPanel;
