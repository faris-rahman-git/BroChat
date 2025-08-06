import api from '@client/configs/axios';
import { updateGroupInfoType } from '@bro/shared';
const GROUP_API = '/user/group';

export const createNewGroupApi = async ({
  groupName,
  groupMembers,
  groupAvatarUrl,
}: {
  groupName: string;
  groupMembers: string[];
  groupAvatarUrl: string;
}) => {
  const res = await api.post(GROUP_API + '/createnewgroup', {
    groupName,
    groupMembers,
    groupAvatarUrl,
  });
  return res.data;
};

export const groupChatListApi = async () => {
  const res = await api.get(GROUP_API + '/groupchatlist');
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
    GROUP_API + '/removegroupmember/' + conversationId + '/' + memberId
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
    GROUP_API + '/makegroupadmin/' + conversationId + '/' + memberId
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
    GROUP_API + '/dismissgroupadmin/' + conversationId + '/' + memberId
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
  const res = await api.put(GROUP_API + '/addgroupmembers/' + conversationId, {
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
  const res = await api.put(GROUP_API + '/updategroupinfo/' + conversationId, {
    groupInfo,
  });
  return res.data;
};

export const exitFromGroupApi = async (conversationId: string) => {
  const res = await api.delete(GROUP_API + '/exitfromgroup/' + conversationId);
  return res.data;
};
