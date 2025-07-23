import api from '@client/configs/axios';

type GetAllUsersParams = {
  searchValue?: string;
  status?: string;
  joinedAt?: string;
};

export const getAllUsersApi = async (params: GetAllUsersParams) => {
  const res = await api.get('/admin/getallusers', { params });
  return res.data;
};

export const getDeletedUsersApi = async (searchValue: string) => {
  const res = await api.get('/admin/getdeletedusers', {
    params: { searchValue },
  });
  return res.data;
};

export const userBlockManagementApi = async ({
  userId,
  isBlocked,
  searchValue,
  status,
  joinedAt,
}: {
  userId: string;
  isBlocked: boolean;
  searchValue: string;
  status: string;
  joinedAt: string;
}) => {
  const res = await api.patch('/admin/userblockmanagement', {
    userId,
    isBlocked,
    searchValue,
    status,
    joinedAt,
  });
  return res.data;
};

export const softDeleteUserApi = async ({
  userId,
  searchValue,
  status,
  joinedAt,
}: {
  userId: string;
  searchValue: string;
  status: string;
  joinedAt: string;
}) => {
  const res = await api.patch('/admin/softdeleteuser', {
    userId,
    searchValue,
    status,
    joinedAt,
  });
  return res.data;
};

export const restoreUserApi = async ({
  userId,
  searchValue,
}: {
  userId: string;
  searchValue: string;
}) => {
  const res = await api.patch('/admin/restoreuser', {
    userId,
    searchValue,
  });
  return res.data;
};

export const hardDeleteUserApi = async ({
  userId,
  searchValue,
}: {
  userId: string;
  searchValue: string;
}) => {
  const res = await api.delete('/admin/harddeleteuser/' + userId, {
    params: { searchValue },
  });
  return res.data;
};
