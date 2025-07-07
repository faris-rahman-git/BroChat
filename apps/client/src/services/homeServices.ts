import api from '@client/configs/axios';

export const searchUserApi = async (data: { searchData: string }) => {
  const res = await api.post('/searchUser', data);
  return res.data;
};

export const chatListApi = async () => {
  const res = await api.get('/chatlist');
  return res.data;
};

export const getPrevMessageApi = async (conversationId: string) => {
  const res = await api.get('/prevmessage/' + conversationId);
  return res.data;
};

export const createNewConversationApi = async (receiverId: string) => {
  const res = await api.post('/createnewconversation', { receiverId });
  return res.data;
};
