import api from '@client/configs/axios';
import {
  GetAllGroupParams,
  BlockGroupParams,
  DeleteGroupParams,
  GetDeletedGroupsParams,
  hardDeleteGroupParams,
} from '@bro/shared';
const GROUP_MANAGEMENT_API = '/admin/groupManagement';

export const getAllGroupsApi = async (params: GetAllGroupParams) => {
  const res = await api.get(GROUP_MANAGEMENT_API + '/getallgroups', { params });
  return res.data;
};

export const groupBlockManagementApi = async ({
  conversationId,
  isBlocked,
  searchValue,
  createdAt,
  page,
  status,
}: BlockGroupParams) => {
  const res = await api.patch(GROUP_MANAGEMENT_API + '/groupblockmanagement', {
    conversationId,
    isBlocked,
    searchValue,
    status,
    createdAt,
    page,
  });
  return res.data;
};

export const groupSoftDeleteManagementApi = async ({
  conversationId,
  isDeleted,
  searchValue,
  status,
  createdAt,
  page,
}: DeleteGroupParams) => {
  const res = await api.patch(
    GROUP_MANAGEMENT_API + '/groupsoftdeletemanagement',
    {
      conversationId,
      isDeleted,
      searchValue,
      status,
      createdAt,
      page,
    }
  );
  return res.data;
};

export const getDeletedGroupsApi = async ({
  searchValue,
  page,
}: GetDeletedGroupsParams) => {
  const res = await api.get(GROUP_MANAGEMENT_API + '/getdeletedgroups', {
    params: { searchValue, page },
  });
  return res.data;
};

export const hardDeleteGroupApi = async ({
  conversationId,
  searchValue,
  page,
}: hardDeleteGroupParams) => {
  const res = await api.delete(GROUP_MANAGEMENT_API + '/harddeletegroup', {
    params: { searchValue, page, conversationId },
  });
  return res.data;
};
