import { Router } from 'express';
import { expressAdapter } from '../../../adapters/expressAdapter';
import { authExpress } from '../../middlewares/authExpress';
import { callTokenComposer } from '../../../../infra/services/composers/user/call/callTokenComposer';

export const callRoute = Router();

callRoute.post(
  '/calltoken',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, callTokenComposer());
  }
);

export default callRoute;
