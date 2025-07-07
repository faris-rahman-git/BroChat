import { CellContext, createColumnHelper } from '@tanstack/react-table';
import DataTable from '../../commonElemets/DataTable';
import ConfirmActionButton from '../../commonElemets/ConfirmActionButton';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { hideLoader, showLoader } from '@client/redux/features/LoaderSlice';
import { DeletedUserListType } from '@bro/shared';
import { MdOutlineDeleteForever, MdOutlineRestore } from 'react-icons/md';
import { useGetDeletedUsers } from '@client/hooks/admin/userManagement/useGetDeletedUsers';
import { useRestoreUser } from '@client/hooks/admin/userManagement/useRestoreUser';
import { useHardDeleteUser } from '@client/hooks/admin/userManagement/useHardDeleteUser';

function DeletedUsersPanel() {
  const [userList, setUserList] = useState<DeletedUserListType[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const dispatch = useAppDispatch();
  const { isPending, isSuccess, isError, mutate, error, data } =
    useGetDeletedUsers();

  const {
    isPending: isPendingRestore,
    isError: isErrorRestore,
    mutate: mutateRestore,
    isSuccess: isSuccessRestore,
    error: errorRestore,
    data: dataRestore,
  } = useRestoreUser();

  const {
    isPending: isPendingHardDelete,
    isError: isErrorHardDelete,
    mutate: mutateHardDelete,
    isSuccess: isSuccessHardDelete,
    error: errorHardDelete,
    data: dataHardDelete,
  } = useHardDeleteUser();

  useEffect(() => {
    if (searchValue.trim().length < 1) {
      mutate(searchValue);
    }
  }, [searchValue]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchValue.trim().length > 1) {
        mutate(searchValue);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchValue]);

  //success handles
  useEffect(() => {
    if (isSuccess) {
      setUserList(data.usersList);
    }
  }, [isSuccess]);
  useEffect(() => {
    if (isSuccessRestore) {
      setUserList(dataRestore.updatedUsersList);
    }
  }, [isSuccessRestore]);
  useEffect(() => {
    if (isSuccessHardDelete) {
      setUserList(dataHardDelete.updatedUsersList);
    }
  }, [isSuccessHardDelete]);

  //error handles
  useEffect(() => {
    if (isError && error?.message) {
      console.log(error.message);
    }
  }, [isError, error]);
  useEffect(() => {
    if (isErrorRestore) {
      console.log(errorRestore.message);
    }
  }, [isErrorRestore]);
  useEffect(() => {
    if (isErrorHardDelete) {
      console.log(errorHardDelete.message);
    }
  }, [isErrorHardDelete]);

  useEffect(() => {
    const anyPending = isPendingRestore || isPendingHardDelete;
    dispatch(anyPending ? showLoader() : hideLoader());
  }, [isPendingRestore, isPendingHardDelete]);

  const handleRestoreUser = (userId: string) => {
    mutateRestore({ userId, searchValue });
  };

  const handleHardDeleteUser = (userId: string) => {
    mutateHardDelete({ userId, searchValue });
  };

  const columnHelper = createColumnHelper<DeletedUserListType>();

  const columns = [
    {
      header: '#',
      cell: (info: CellContext<DeletedUserListType, unknown>) => {
        return <span>{info.row.index + 1}</span>; // Index starts from 0
      },
    },
    columnHelper.accessor('username', { header: 'User Name' }),
    columnHelper.accessor('email', { header: 'Email' }),
    columnHelper.accessor('createdAt', {
      header: 'Joined At',
      cell: (info: CellContext<DeletedUserListType, unknown>) => {
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
      cell: (info: CellContext<DeletedUserListType, unknown>) => {
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
      cell: (info: CellContext<DeletedUserListType, unknown>) => {
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
    />
  );
}

export default DeletedUsersPanel;
