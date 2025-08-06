import { Router } from 'express';
import { authAdmin } from '../../middlewares/authAdmin';
import { expressAdapter } from '../../../adapters/expressAdapter';
import { getAllRepotsComposer } from '../../../../infra/services/composers/admin/reportManagement/getAllRepotsComposer';
import { getResolvedRepotsComposer } from '../../../../infra/services/composers/admin/reportManagement/getResolvedRepotsComposer';
import { getDeletedRepotsComposer } from '../../../../infra/services/composers/admin/reportManagement/getDeletedRepotsComposer';
import { blockReporedUserComposer } from '../../../../infra/services/composers/admin/reportManagement/blockReporedUserComposer';
import { deleteReportComposer } from '../../../../infra/services/composers/admin/reportManagement/deleteReportComposer';
import { ignoreReportComposer } from '../../../../infra/services/composers/admin/reportManagement/ignoreReportComposer';
import { hardDeleteReportComposer } from '../../../../infra/services/composers/admin/reportManagement/hardDeleteReportComposer';

const reportManagementRoute = Router();

reportManagementRoute.get(
  '/getallrepots',
  authAdmin,
  async (request, response) => {
    await expressAdapter(request, response, getAllRepotsComposer());
  }
);

reportManagementRoute.get(
  '/getresolvedrepots',
  authAdmin,
  async (request, response) => {
    await expressAdapter(request, response, getResolvedRepotsComposer());
  }
);

reportManagementRoute.get(
  '/getdeletedrepots',
  authAdmin,
  async (request, response) => {
    await expressAdapter(request, response, getDeletedRepotsComposer());
  }
);

reportManagementRoute.patch(
  '/blockreporeduser',
  authAdmin,
  async (request, response) => {
    await expressAdapter(request, response, blockReporedUserComposer());
  }
);

reportManagementRoute.patch(
  '/deletereport',
  authAdmin,
  async (request, response) => {
    await expressAdapter(request, response, deleteReportComposer());
  }
);

reportManagementRoute.patch(
  '/ignorereport',
  authAdmin,
  async (request, response) => {
    await expressAdapter(request, response, ignoreReportComposer());
  }
);

reportManagementRoute.delete(
  '/harddeletereport/:reportId',
  authAdmin,
  async (request, response) => {
    await expressAdapter(request, response, hardDeleteReportComposer());
  }
);

export default reportManagementRoute;
