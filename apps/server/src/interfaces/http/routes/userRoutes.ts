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
import {
  chatList,
  createNewConversation,
  getPrevMessages,
  searchUser,
} from '../controllers/userControllers/homeControllers';
import { authExpress } from '../../../infrastructure/middlewares/auth/authExpress';

const router = Router();

//Auth
router.post('/register', register);

router.post('/otpandpassword', otpAndPassword);

router.post('/resendotp', resendOtp);

router.post('/login', login);

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

router.get('/logout', authExpress, logout);

//home
router.post('/searchUser', authExpress, searchUser);

router.post('/createnewconversation', authExpress, createNewConversation);

router.get('/chatlist', authExpress, chatList);

router.get('/prevmessage/:conversationId', authExpress, getPrevMessages);

export default router;
