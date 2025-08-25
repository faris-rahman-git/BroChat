import { Router } from 'express';
import { expressAdapter } from '../../../adapters/expressAdapter';
import { authExpress } from '../../middlewares/authExpress';
import { prevMessageComposer } from '../../../../infra/services/composers/user/message/prevMessageComposer';
import { deleteMessageComposer } from '../../../../infra/services/composers/user/message/deleteMessageComposer';
import { addReactionComposer } from '../../../../infra/services/composers/user/message/addReactionComposer';
import { removeReactionComposer } from '../../../../infra/services/composers/user/message/removeReactionComposer';

const messageRoute = Router();

messageRoute.get(
  '/prevmessage/:conversationId',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, prevMessageComposer());
  }
);

messageRoute.patch(
  '/deletemessage/:conversationId',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, deleteMessageComposer());
  }
);

messageRoute.post('/addreaction', authExpress, async (request, response) => {
  await expressAdapter(request, response, addReactionComposer());
});

messageRoute.delete(
  '/removereaction/:conversationId/:messageId',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, removeReactionComposer());
  }
);

export default messageRoute;
