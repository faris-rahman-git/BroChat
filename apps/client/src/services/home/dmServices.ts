import api from '@client/configs/axios';
import { ReportUserType } from '@bro/shared';
const DM_API = '/user/dm';

export const createNewConversationApi = async (receiverId: string) => {
  const res = await api.post(DM_API + '/createnewconversation', { receiverId });
  return res.data;
};

export const oneToOneChatListApi = async () => {
  const res = await api.get(DM_API + '/onetoonechatlist');
  return res.data;
};

export const searchUserApi = async (data: { searchData: string }) => {
  const res = await api.post(DM_API + '/searchUser', data);
  return res.data;
};

export const reportUserApi = async ({
  reportedUserId,
  conversationId,
  reason,
}: ReportUserType) => {
  const res = await api.post(DM_API + '/reportuser', {
    reportedUserId,
    conversationId,
    reason,
  });
  return res.data;
};

export const blockUserApi = async (conversationId: string) => {
  const res = await api.put(DM_API + '/blockuser', {
    conversationId,
  });
  return res.data;
};

export const unBlockUserApi = async (conversationId: string) => {
  const res = await api.put(DM_API + '/unblockuser', {
    conversationId,
  });
  return res.data;
};
