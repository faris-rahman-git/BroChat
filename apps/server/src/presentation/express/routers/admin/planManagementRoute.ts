import { Router } from 'express';
import { expressAdapter } from '../../../adapters/expressAdapter';
import { authExpress } from '../../middlewares/authExpress';
import { saveNewSubscriptionPlanComposer } from '../../../../infra/services/composers/admin/planManagement/saveNewSubscriptionPlanComposer';
import { getAllPlansComposer } from '../../../../infra/services/composers/admin/planManagement/getAllPlansComposer';
import { updatePlanComposer } from '../../../../infra/services/composers/admin/planManagement/updatePlanComposer';

export const planRoute = Router();

planRoute.get(
  '/getallplans/:selectedChild',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, getAllPlansComposer());
  }
);

planRoute.post(
  '/savenewsubscriptionplan',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, saveNewSubscriptionPlanComposer());
  }
);

planRoute.put(
  '/updateplan/:selectedChild',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, updatePlanComposer());
  }
);

export default planRoute;
