import { Router } from 'express';
import { expressAdapter } from '../../../adapters/expressAdapter';
import { authExpress } from '../../middlewares/authExpress';
import { oneToOneChatListComposer } from '../../../../infra/services/composers/user/dms/oneToOneChatListComposer';
import { searchUserComposer } from '../../../../infra/services/composers/user/dms/searchUserComposer';
import { createNewConversationComposer } from '../../../../infra/services/composers/user/dms/createNewConversationComposer';
import { reportUserComposer } from '../../../../infra/services/composers/user/dms/reportUserComposer';
import { blockUserComposer } from '../../../../infra/services/composers/user/dms/blockUserComposer';
import { unblockUserComposer } from '../../../../infra/services/composers/user/dms/unblockUserComposer';

export const dmRoute = Router();

dmRoute.get('/onetoonechatlist', authExpress, async (request, response) => {
  await expressAdapter(request, response, oneToOneChatListComposer());
});

dmRoute.post('/searchUser', authExpress, async (request, response) => {
  await expressAdapter(request, response, searchUserComposer());
});

dmRoute.post(
  '/createnewconversation',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, createNewConversationComposer());
  }
);

dmRoute.post('/reportuser', authExpress, async (request, response) => {
  await expressAdapter(request, response, reportUserComposer());
});

dmRoute.put('/blockuser', authExpress, async (request, response) => {
  await expressAdapter(request, response, blockUserComposer());
});

dmRoute.put('/unblockuser', authExpress, async (request, response) => {
  await expressAdapter(request, response, unblockUserComposer());
});

export default dmRoute;
