import { Router } from 'express';
import {
  forgotPassword,
  login,
  logout,
  otpAndPassword,
  refreshToken,
  register,
  resendOtp,
  resetPassword,
  socialRegisterOrLogin,
} from '../controllers/userControllers/authControllers';
import passport from 'passport';
import { authExpress } from '../../../infrastructure/middlewares/auth/authExpress';
import {
  blockUserHandler,
  createNewConversationHandler,
  oneToOneChatListHandler,
  reportUserHandler,
  searchUserHandler,
  unblockUserHandler,
} from '../controllers/userControllers/dmControllers';
import {
  addGroupMembersHandler,
  createNewGroupHandler,
  dismissGroupAdminHandler,
  groupChatListHandler,
  makeGroupAdminHandler,
  removeGroupMemberHandler,
  updateGroupInfoHandler,
} from '../controllers/userControllers/groupControllers';
import {
  deleteMessageHandler,
  getPrevMessagesHandler,
} from '../controllers/userControllers/messageControllers';
import {
  deleteFromS3Handler,
  s3UrlHandler,
} from '../controllers/userControllers/commonControllers';

const router = Router();

//Auth
router.post('/register', register);
router.post('/otpandpassword', otpAndPassword);
router.post('/resendotp', resendOtp);

router.post('/login', login);
router.get('/logout', authExpress, logout);

router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword', resetPassword);

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  socialRegisterOrLogin
);
router.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false }),
  socialRegisterOrLogin
);
router.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  socialRegisterOrLogin
);

router.get('/refresh', refreshToken);

//home
//DMs Api
router.get('/onetoonechatlist', authExpress, oneToOneChatListHandler);
router.post('/searchUser', authExpress, searchUserHandler);
router.post(
  '/createnewconversation',
  authExpress,
  createNewConversationHandler
);
router.post('/reportuser', authExpress, reportUserHandler);
router.put('/blockuser', authExpress, blockUserHandler);
router.put('/unblockuser', authExpress, unblockUserHandler);

//Group Api
router.get('/groupchatlist', authExpress, groupChatListHandler);
router.post('/createnewgroup', authExpress, createNewGroupHandler);
router.delete(
  '/removegroupmember/:conversationId/:memberId',
  authExpress,
  removeGroupMemberHandler
);
router.put(
  '/makegroupadmin/:conversationId/:memberId',
  authExpress,
  makeGroupAdminHandler
);
router.put(
  '/dismissgroupadmin/:conversationId/:memberId',
  authExpress,
  dismissGroupAdminHandler
);
router.put(
  '/addgroupmembers/:conversationId',
  authExpress,
  addGroupMembersHandler
);
router.put(
  '/updategroupinfo/:conversationId',
  authExpress,
  updateGroupInfoHandler
);

//Message Api
router.get('/prevmessage/:conversationId', authExpress, getPrevMessagesHandler);
router.delete(
  '/deletemessage/:conversationId/:messageId',
  authExpress,
  deleteMessageHandler
);

//Common Api
router.post('/s3url', authExpress, s3UrlHandler);
router.delete('/deletefroms3', authExpress, deleteFromS3Handler);

export default router;
