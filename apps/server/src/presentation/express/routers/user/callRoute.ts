import { Router } from 'express';
import { expressAdapter } from '../../../adapters/expressAdapter';
import { authExpress } from '../../middlewares/authExpress';
import { callTokenComposer } from '../../../../infra/services/composers/user/call/callTokenComposer';
import { callInviteComposer } from '../../../../infra/services/composers/user/call/callInviteComposer';

export const callRoute = Router();

callRoute.post(
  '/calltoken',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, callTokenComposer());
  }
);

callRoute.post(
  '/callinvite',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, callInviteComposer());
  }
);

export default callRoute;
