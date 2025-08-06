import api from '@client/configs/axios';
const CALL_API = '/user/call';

export const getTokenApi = async () => {
  const res = await api.post(CALL_API + '/calltoken');
  return res.data;
};
