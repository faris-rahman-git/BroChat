import { Router } from 'express';
import passport from 'passport';
import { authExpress } from '../../middlewares/authExpress';

import { expressAdapter } from '../../../adapters/expressAdapter';
import { otpAndPasswordComposer } from '../../../../infra/services/composers/auth/otpAndPasswordComposer';
import { resendOtpComposer } from '../../../../infra/services/composers/auth/resendOtpComposer';
import { loginComposer } from '../../../../infra/services/composers/auth/loginComposer';
import { logoutComposer } from '../../../../infra/services/composers/auth/logoutComposer';
import { forgotPasswordComposer } from '../../../../infra/services/composers/auth/forgotPasswordComposer';
import { resetPasswordComposer } from '../../../../infra/services/composers/auth/resetPasswordComposer';
import { refreshComposer } from '../../../../infra/services/composers/auth/refreshComposer';
import { socialRegisterOrLoginComposer } from '../../../../infra/services/composers/auth/socialRegisterOrLoginComposer';
import { registerComposer } from '../../../../infra/services/composers/auth/registerComposer';

export const authRoute = Router();

authRoute.post('/register', async (request, response) => {
  await expressAdapter(request, response, registerComposer());
});

authRoute.post('/otpAndPassword', async (request, response) => {
  await expressAdapter(request, response, otpAndPasswordComposer());
});

authRoute.post('/resendotp', async (request, response) => {
  await expressAdapter(request, response, resendOtpComposer());
});

authRoute.post('/login', async (request, response) => {
  await expressAdapter(request, response, loginComposer());
});

authRoute.get('/logout', authExpress, async (request, response) => {
  await expressAdapter(request, response, logoutComposer());
});

authRoute.post('/forgotpassword', async (request, response) => {
  await expressAdapter(request, response, forgotPasswordComposer());
});

authRoute.put('/resetpassword', async (request, response) => {
  await expressAdapter(request, response, resetPasswordComposer());
});

authRoute.get('/refresh', async (request, response) => {
  await expressAdapter(request, response, refreshComposer());
});

authRoute.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRoute.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  async (request, response) => {
    await expressAdapter(request, response, socialRegisterOrLoginComposer());
  }
);

authRoute.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

authRoute.get(
  '/github/callback',
  passport.authenticate('github', { session: false }),
  async (request, response) => {
    await expressAdapter(request, response, socialRegisterOrLoginComposer());
  }
);

authRoute.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

authRoute.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  async (request, response) => {
    await expressAdapter(request, response, socialRegisterOrLoginComposer());
  }
);

export default authRoute;
