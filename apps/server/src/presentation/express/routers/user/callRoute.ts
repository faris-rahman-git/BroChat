import { Router } from 'express';
import { expressAdapter } from '../../../adapters/expressAdapter';
import { authExpress } from '../../middlewares/authExpress';
import { callTokenComposer } from '../../../../infra/services/composers/user/call/callTokenComposer';
import { callInviteComposer } from '../../../../infra/services/composers/user/call/callInviteComposer';
import { callAcceptComposer } from '../../../../infra/services/composers/user/call/callAcceptComposer';
import { callRejectComposer } from '../../../../infra/services/composers/user/call/callRejectComposer';
import { callLeftComposer } from '../../../../infra/services/composers/user/call/callLeftComposer';
import { callEndComposer } from '../../../../infra/services/composers/user/call/callEndComposer';
import { callListComposer } from '../../../../infra/services/composers/user/call/callListComposer';

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

callRoute.put(
  '/callaccept',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, callAcceptComposer());
  }
);

callRoute.put(
  '/callreject',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, callRejectComposer());
  }
);

callRoute.put(
  '/callleft',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, callLeftComposer());
  }
);

callRoute.put(
  '/callend',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, callEndComposer());
  }
);

callRoute.get(
  '/calllist',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, callListComposer());
  }
);

export default callRoute;
