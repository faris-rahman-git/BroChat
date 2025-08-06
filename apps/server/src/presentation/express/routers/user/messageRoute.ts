import { Router } from 'express';
import { expressAdapter } from '../../../adapters/expressAdapter';
import { authExpress } from '../../middlewares/authExpress';
import { prevMessageComposer } from '../../../../infra/services/composers/user/message/prevMessageComposer';
import { deleteMessageComposer } from '../../../../infra/services/composers/user/message/deleteMessageComposer';

const messageRoute = Router();

messageRoute.get(
  '/prevmessage/:conversationId',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, prevMessageComposer());
  }
);

messageRoute.delete(
  '/deletemessage/:conversationId/:messageId',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, deleteMessageComposer());
  }
);

export default messageRoute;
