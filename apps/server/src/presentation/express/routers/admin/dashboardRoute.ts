import { Router } from 'express';
import { expressAdapter } from '../../../adapters/expressAdapter';
import { authAdmin } from '../../middlewares/authAdmin';
import { getDashboardComposer } from '../../../../infra/services/composers/admin/dashboard/getDashboardComposer';

const dashboardRoute = Router();

dashboardRoute.get('/getdashboard', authAdmin, async (request, response) => {
  await expressAdapter(request, response, getDashboardComposer());
});

export default dashboardRoute;
