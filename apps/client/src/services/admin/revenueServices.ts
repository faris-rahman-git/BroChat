import api from '@client/configs/axios';
import {
  getAllPaymetsType,
  GetExclusiveUserPaymentsApiType,
} from '@bro/shared';
const REVENUE_MANAGEMENT_API = '/admin/revenueManagement';

export const getAllTransactionsApi = async (params: getAllPaymetsType) => {
  const res = await api.get(REVENUE_MANAGEMENT_API + '/getalltransactions', {
    params,
  });
  return res.data;
};

export const getExclusiveUserPaymentsApi = async (
  params: GetExclusiveUserPaymentsApiType
) => {
  const res = await api.get(
    REVENUE_MANAGEMENT_API + '/getexclusiveuserpayments',
    { params }
  );
  return res.data;
};
