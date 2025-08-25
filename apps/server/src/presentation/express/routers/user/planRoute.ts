import { Router } from 'express';
import { expressAdapter } from '../../../adapters/expressAdapter';
import { authExpress } from '../../middlewares/authExpress';
import { getAllPlansComposer } from '../../../../infra/services/composers/user/plan/getAllPlansComposer';
import { createPlanComposer } from '../../../../infra/services/composers/user/plan/createPlanComposer';
import { editExclusivePlanComposer } from '../../../../infra/services/composers/user/plan/editExclusivePlanComposer';
import { getExclusiveCustomPlanComposer } from '../../../../infra/services/composers/user/plan/getExclusiveCustomPlanComposer';

const planRoute = Router();

planRoute.get(
  '/getAllPlans/:selectedChild',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, getAllPlansComposer());
  }
);

planRoute.get(
  '/getExclusiveCustomPlan/:userId',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, getExclusiveCustomPlanComposer());
  }
);

planRoute.post('/createplan', authExpress, async (request, response) => {
  await expressAdapter(request, response, createPlanComposer());
});

planRoute.put('/editExclusivePlan', authExpress, async (request, response) => {
  await expressAdapter(request, response, editExclusivePlanComposer());
});

export default planRoute;
