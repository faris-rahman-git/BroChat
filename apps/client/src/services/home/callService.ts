import api from '@client/configs/axios';
import { CallInvite } from '@bro/shared';
const CALL_API = '/user/call';

export const getTokenApi = async () => {
  const res = await api.post(CALL_API + '/calltoken');
  return res.data;
};

export const callInviteApi = async (data: CallInvite) => {
  const res = await api.post(CALL_API + '/callinvite', data);
  return res.data;
};
