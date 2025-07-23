import { Router } from 'express';
import { authAdmin } from '../../../infrastructure/middlewares/auth/authAdmin';
import {
  getAllUsers,
  getDeletedUsers,
  hardDeleteUser,
  restoreUser,
  softDeleteUser,
  userBlockManagement,
} from '../controllers/adminControllers/userManagement';
import {
  blockReporedUserHandler,
  deleteReportHandler,
  getAllReportHandler,
  getDeletedRepotsHandler,
  getResolvedRepotsHandler,
  hardDeleteReportHandler,
  ignoreReportHandler,
} from '../controllers/adminControllers/reportManagement';
const router = Router();

//user Route
router.get('/getallusers', authAdmin, getAllUsers);
router.patch('/userblockmanagement', authAdmin, userBlockManagement);
router.patch('/softdeleteuser', authAdmin, softDeleteUser);

router.get('/getdeletedusers', authAdmin, getDeletedUsers);
router.patch('/restoreuser', authAdmin, restoreUser);
router.delete('/harddeleteuser/:userId', authAdmin, hardDeleteUser);

//report Route
router.get('/getAllRepots', authAdmin, getAllReportHandler);
router.get('/getresolvedrepots', authAdmin, getResolvedRepotsHandler);
router.get('/getdeletedrepots', authAdmin, getDeletedRepotsHandler);
router.patch('/blockreporeduser', authAdmin, blockReporedUserHandler);
router.patch('/deletereport', authAdmin, deleteReportHandler);
router.patch('/ignorereport', authAdmin, ignoreReportHandler);
router.delete(
  '/harddeletereport/:reportId',
  authAdmin,
  hardDeleteReportHandler
);

export default router;
