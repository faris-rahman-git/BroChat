import api from '@client/configs/axios';
import { acceptCallApiType, CallInvite, rejectCallApiType } from '@bro/shared';
const CALL_API = '/user/call';

export const callInviteApi = async (data: CallInvite) => {
  const res = await api.post(CALL_API + '/callinvite', data);
  return res.data;
};

export const callAcceptApi = async ({
  joinedAt,
  roomId,
}: acceptCallApiType) => {
  const res = await api.put(CALL_API + '/callaccept', { joinedAt, roomId });
  return res.data;
};

export const callRejectApi = async ({
  isGroupCall,
  roomId,
}: rejectCallApiType) => {
  const res = await api.put(CALL_API + '/callreject', {
    isGroupCall,
    roomId,
  });
  return res.data;
};

export const callListApi = async () => {
  const res = await api.get(CALL_API + '/calllist');
  return res.data;
};
