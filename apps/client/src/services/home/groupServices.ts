import api from '@client/configs/axios';
import { updateGroupInfoType } from '@bro/shared';

export const createNewGroupApi = async ({
  groupName,
  groupMembers,
  groupAvatarUrl,
}: {
  groupName: string;
  groupMembers: string[];
  groupAvatarUrl: string;
}) => {
  const res = await api.post('/createnewgroup', {
    groupName,
    groupMembers,
    groupAvatarUrl,
  });
  return res.data;
};

export const groupChatListApi = async () => {
  const res = await api.get('/groupchatlist');
  return res.data;
};

export const removeGroupMemberApi = async ({
  conversationId,
  memberId,
}: {
  conversationId: string;
  memberId: string;
}) => {
  const res = await api.delete(
    '/removegroupmember/' + conversationId + '/' + memberId
  );
  return res.data;
};

export const makeGroupAdminApi = async ({
  conversationId,
  memberId,
}: {
  conversationId: string;
  memberId: string;
}) => {
  const res = await api.put(
    '/makegroupadmin/' + conversationId + '/' + memberId
  );
  return res.data;
};

export const dismissGroupAdminApi = async ({
  conversationId,
  memberId,
}: {
  conversationId: string;
  memberId: string;
}) => {
  const res = await api.put(
    '/dismissgroupadmin/' + conversationId + '/' + memberId
  );
  return res.data;
};

export const addGroupMembersApi = async ({
  conversationId,
  newMembersId,
}: {
  conversationId: string;
  newMembersId: string[];
}) => {
  const res = await api.put('/addgroupmembers/' + conversationId, {
    newMembersId,
  });
  return res.data;
};

export const updateGroupInfoApi = async ({
  conversationId,
  groupInfo,
}: {
  conversationId: string;
  groupInfo: updateGroupInfoType;
}) => {
  const res = await api.put('/updategroupinfo/' + conversationId, {
    groupInfo,
  });
  return res.data;
};
