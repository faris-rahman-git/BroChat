import { Router } from 'express';
import { expressAdapter } from '../../../adapters/expressAdapter';
import { authAdmin } from '../../middlewares/authAdmin';
import { getAllTransactionsComposer } from '../../../../infra/services/composers/admin/revenueManagement/getAllTransactionsComposer';
import { getExclusiveUserPaymentsComposer } from '../../../../infra/services/composers/admin/revenueManagement/getExclusiveUserPaymentsComposer';

const revenueManagementRoute = Router();

revenueManagementRoute.get(
  '/getalltransactions',
  authAdmin,
  async (request, response) => {
    await expressAdapter(request, response, getAllTransactionsComposer());
  }
);

revenueManagementRoute.get(
  '/getexclusiveuserpayments',
  authAdmin,
  async (request, response) => {
    await expressAdapter(request, response, getExclusiveUserPaymentsComposer());
  }
);

export default revenueManagementRoute;
