import api from '@client/configs/axios';
const USER_MANAGEMENT_API = '/admin/userManagement';

type GetAllUsersParams = {
  searchValue?: string;
  status?: string;
  joinedAt?: string;
  page: number;
};

export const getAllUsersApi = async (params: GetAllUsersParams) => {
  const res = await api.get(USER_MANAGEMENT_API + '/getallusers', { params });
  return res.data;
};

export const getDeletedUsersApi = async ({
  searchValue,
  page,
}: {
  searchValue: string;
  page: number;
}) => {
  const res = await api.get(USER_MANAGEMENT_API + '/getdeletedusers', {
    params: { searchValue, page },
  });
  return res.data;
};

export const userBlockManagementApi = async ({
  userId,
  isBlocked,
  searchValue,
  status,
  joinedAt,
  page,
}: {
  userId: string;
  isBlocked: boolean;
  searchValue: string;
  status: string;
  joinedAt: string;
  page: number;
}) => {
  const res = await api.patch(USER_MANAGEMENT_API + '/userblockmanagement', {
    userId,
    isBlocked,
    searchValue,
    status,
    joinedAt,
    page,
  });
  return res.data;
};

export const softDeleteUserApi = async ({
  userId,
  searchValue,
  status,
  joinedAt,
  page,
}: {
  userId: string;
  searchValue: string;
  status: string;
  joinedAt: string;
  page: number;
}) => {
  const res = await api.patch(USER_MANAGEMENT_API + '/softdeleteuser', {
    userId,
    searchValue,
    status,
    joinedAt,
    page,
  });
  return res.data;
};

export const restoreUserApi = async ({
  userId,
  searchValue,
  page,
}: {
  userId: string;
  searchValue: string;
  page: number;
}) => {
  const res = await api.patch(USER_MANAGEMENT_API + '/restoreuser', {
    userId,
    searchValue,
    page,
  });
  return res.data;
};

export const hardDeleteUserApi = async ({
  userId,
  searchValue,
  page,
}: {
  userId: string;
  searchValue: string;
  page: number;
}) => {
  const res = await api.delete(
    USER_MANAGEMENT_API + '/harddeleteuser/' + userId,
    {
      params: { searchValue, page },
    }
  );
  return res.data;
};
