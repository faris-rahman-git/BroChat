import api from '@client/configs/axios';
import { ReportUserType } from '@bro/shared';

export const createNewConversationApi = async (receiverId: string) => {
  const res = await api.post('/createnewconversation', { receiverId });
  return res.data;
};

export const oneToOneChatListApi = async () => {
  const res = await api.get('/onetoonechatlist');
  return res.data;
};

export const searchUserApi = async (data: { searchData: string }) => {
  const res = await api.post('/searchUser', data);
  return res.data;
};

export const reportUserApi = async ({
  reportedUserId,
  conversationId,
  reason,
}: ReportUserType) => {
  const res = await api.post('/reportuser', {
    reportedUserId,
    conversationId,
    reason,
  });
  return res.data;
};

export const blockUserApi = async (conversationId: string) => {
  const res = await api.put('/blockuser', {
    conversationId,
  });
  return res.data;
};

export const unBlockUserApi = async (conversationId: string) => {
  const res = await api.put('/unblockuser', {
    conversationId,
  });
  return res.data;
};
