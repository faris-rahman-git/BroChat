import api from '@client/configs/axios';
import { ProfileUpdateInfoParams } from '@bro/shared';
const Profile_API = '/user/profile';

export const updateProfileInfoApi = async ({
  userId,
  profileInfo,
}: {
  userId: string;
  profileInfo: ProfileUpdateInfoParams;
}) => {
  const res = await api.post(
    Profile_API + '/updateprofileinfo' + '/' + userId,
    profileInfo
  );
  return res.data;
};

export const deleteAccountApi = async () => {
  const res = await api.patch(Profile_API + '/deleteaccount');
  return res.data;
};
