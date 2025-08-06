import { Router } from 'express';
import { expressAdapter } from '../../../adapters/expressAdapter';
import { authExpress } from '../../middlewares/authExpress';
import { groupChatListComposer } from '../../../../infra/services/composers/user/group/groupChatListComposer';
import { createNewGroupComposer } from '../../../../infra/services/composers/user/group/createNewGroupComposer';
import { removeGroupMemberComposer } from '../../../../infra/services/composers/user/group/removeGroupMemberComposer';
import { makeGroupAdminComposer } from '../../../../infra/services/composers/user/group/makeGroupAdminComposer';
import { dismissGroupAdminComposer } from '../../../../infra/services/composers/user/group/dismissGroupAdminComposer';
import { addGroupMembersComposer } from '../../../../infra/services/composers/user/group/addGroupMembersComposer';
import { updateGroupInfoComposer } from '../../../../infra/services/composers/user/group/updateGroupInfoComposer';
import { exitFromGroupComposer } from '../../../../infra/services/composers/user/group/exitFromGroupComposer';

export const groupRoute = Router();

groupRoute.get('/groupchatlist', authExpress, async (request, response) => {
  await expressAdapter(request, response, groupChatListComposer());
});

groupRoute.post('/createnewgroup', authExpress, async (request, response) => {
  await expressAdapter(request, response, createNewGroupComposer());
});

groupRoute.delete(
  '/removegroupmember/:conversationId/:memberId',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, removeGroupMemberComposer());
  }
);

groupRoute.delete(
  '/exitfromgroup/:conversationId',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, exitFromGroupComposer());
  }
);

groupRoute.put(
  '/makegroupadmin/:conversationId/:memberId',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, makeGroupAdminComposer());
  }
);

groupRoute.put(
  '/dismissgroupadmin/:conversationId/:memberId',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, dismissGroupAdminComposer());
  }
);

groupRoute.put(
  '/addgroupmembers/:conversationId',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, addGroupMembersComposer());
  }
);

groupRoute.put(
  '/updategroupinfo/:conversationId',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, updateGroupInfoComposer());
  }
);

export default groupRoute;
