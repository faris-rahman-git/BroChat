import { Router } from 'express';
import { expressAdapter } from '../../../adapters/expressAdapter';
import { authExpress } from '../../middlewares/authExpress';
import { getAllGroupsComposer } from '../../../../infra/services/composers/admin/groupManagement/getAllGroupsComposer';
import { groupBlockManagementComposer } from '../../../../infra/services/composers/admin/groupManagement/groupBlockManagementComposer';
import { groupSoftDeleteManagementComposer } from '../../../../infra/services/composers/admin/groupManagement/groupSoftDeleteManagementComposer';
import { getDeletedGroupsComposer } from '../../../../infra/services/composers/admin/groupManagement/getDeletedGroupsComposer';
import { authAdmin } from '../../middlewares/authAdmin';
import { hardDeleteGroupComposer } from '../../../../infra/services/composers/admin/groupManagement/hardDeleteGroupComposer';

export const groupManagementRoute = Router();

groupManagementRoute.get(
  '/getallgroups',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, getAllGroupsComposer());
  }
);

groupManagementRoute.patch(
  '/groupblockmanagement',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, groupBlockManagementComposer());
  }
);

groupManagementRoute.patch(
  '/groupsoftdeletemanagement',
  authExpress,
  async (request, response) => {
    await expressAdapter(
      request,
      response,
      groupSoftDeleteManagementComposer()
    );
  }
);

groupManagementRoute.get(
  '/getdeletedgroups',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, getDeletedGroupsComposer());
  }
);

groupManagementRoute.get(
  '/getdeletedgroups',
  authExpress,
  async (request, response) => {
    await expressAdapter(request, response, getDeletedGroupsComposer());
  }
);

groupManagementRoute.delete(
  '/harddeletegroup',
  authAdmin,
  async (request, response) => {
    await expressAdapter(request, response, hardDeleteGroupComposer());
  }
);

export default groupManagementRoute;
