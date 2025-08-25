import { Router } from 'express';
import { expressAdapter } from '../../../adapters/expressAdapter';
import { authExpress } from '../../middlewares/authExpress';
import { updateProfileInfoComposer } from '../../../../infra/services/composers/user/profile/updateProfileInfoComposer';
import { deleteAccountComposer } from '../../../../infra/services/composers/user/profile/deleteAccountComposer';
import { getAllTransactionsComposer } from '../../../../infra/services/composers/user/profile/getAllTransactionsComposer';

export const profileRoute = Router();

profileRoute.post(
  '/updateprofileinfo/:userId',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, updateProfileInfoComposer());
  }
);

profileRoute.patch('/deleteaccount', authExpress, async (request, response) => {
  await expressAdapter(request, response, deleteAccountComposer());
});

profileRoute.get(
  '/getalltransactions',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, getAllTransactionsComposer());
  }
);

export default profileRoute;
