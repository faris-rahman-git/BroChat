import { Router } from 'express';
import { expressAdapter } from '../../../adapters/expressAdapter';
import { authExpress } from '../../middlewares/authExpress';
import { callInviteComposer } from '../../../../infra/services/composers/user/call/callInviteComposer';
import { callAcceptComposer } from '../../../../infra/services/composers/user/call/callAcceptComposer';
import { callRejectComposer } from '../../../../infra/services/composers/user/call/callRejectComposer';
import { callListComposer } from '../../../../infra/services/composers/user/call/callListComposer';

export const callRoute = Router();

callRoute.post('/callinvite', authExpress, async (request, response) => {
  await expressAdapter(request, response, callInviteComposer());
});

callRoute.put('/callaccept', authExpress, async (request, response) => {
  await expressAdapter(request, response, callAcceptComposer());
});

callRoute.put('/callreject', authExpress, async (request, response) => {
  await expressAdapter(request, response, callRejectComposer());
});

callRoute.get('/calllist', authExpress, async (request, response) => {
  await expressAdapter(request, response, callListComposer());
});

export default callRoute;
