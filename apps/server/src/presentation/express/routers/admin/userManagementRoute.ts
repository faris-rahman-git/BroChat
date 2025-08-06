import { Router } from 'express';
import { expressAdapter } from '../../../adapters/expressAdapter';
import { authAdmin } from '../../middlewares/authAdmin';
import { getAllUsersComposer } from '../../../../infra/services/composers/admin/userManageMent/getAllUsersComposer';
import { userBlockManagementComposer } from '../../../../infra/services/composers/admin/userManageMent/userBlockManagementComposer';
import { softDeleteUserComposer } from '../../../../infra/services/composers/admin/userManageMent/softDeleteUserComposer';
import { getDeletedUsersComposer } from '../../../../infra/services/composers/admin/userManageMent/getDeletedUsersComposer';
import { restoreUserComposer } from '../../../../infra/services/composers/admin/userManageMent/restoreUserComposer';
import { hardDeleteUserComposer } from '../../../../infra/services/composers/admin/userManageMent/hardDeleteUserComposer';

export const userManagementRoute = Router();

userManagementRoute.get(
  '/getallusers',
  authAdmin,
  async (request, response) => {
    await expressAdapter(request, response, getAllUsersComposer());
  }
);

userManagementRoute.patch(
  '/userblockmanagement',
  authAdmin,
  async (request, response) => {
    await expressAdapter(request, response, userBlockManagementComposer());
  }
);

userManagementRoute.patch(
  '/softdeleteuser',
  authAdmin,
  async (request, response) => {
    await expressAdapter(request, response, softDeleteUserComposer());
  }
);

userManagementRoute.get(
  '/getdeletedusers',
  authAdmin,
  async (request, response) => {
    await expressAdapter(request, response, getDeletedUsersComposer());
  }
);

userManagementRoute.patch(
  '/restoreuser',
  authAdmin,
  async (request, response) => {
    await expressAdapter(request, response, restoreUserComposer());
  }
);

userManagementRoute.delete(
  '/harddeleteuser/:userId',
  authAdmin,
  async (request, response) => {
    await expressAdapter(request, response, hardDeleteUserComposer());
  }
);

export default userManagementRoute;
