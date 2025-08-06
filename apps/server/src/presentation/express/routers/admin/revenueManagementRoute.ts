import { Router } from 'express';
import { expressAdapter } from '../../../adapters/expressAdapter';
import { authAdmin } from '../../middlewares/authAdmin';
import { getAllTransactionsComposer } from '../../../../infra/services/composers/admin/revenueManagement/getAllTransactionsComposer';

const revenueManagementRoute = Router();

revenueManagementRoute.get(
  '/getalltransactions',
  authAdmin,
  async (request, response) => {
    await expressAdapter(request, response, getAllTransactionsComposer());
  }
);

export default revenueManagementRoute;
