import api from '@client/configs/axios';
const DASH_BOARD_API = '/admin/dashboard';

export const getDashBoardApi = async () => {
  const res = await api.get(DASH_BOARD_API + '/getdashboard');
  return res.data;
};


