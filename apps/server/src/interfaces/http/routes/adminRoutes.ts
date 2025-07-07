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
const router = Router();

router.get('/getallusers', authAdmin, getAllUsers);

router.patch('/userblockmanagement', authAdmin, userBlockManagement);

router.patch('/softdeleteuser', authAdmin, softDeleteUser);

router.get('/getdeletedusers', authAdmin, getDeletedUsers);

router.patch('/restoreuser', authAdmin, restoreUser);

router.delete('/harddeleteuser/:userId', authAdmin, hardDeleteUser);

export default router;
