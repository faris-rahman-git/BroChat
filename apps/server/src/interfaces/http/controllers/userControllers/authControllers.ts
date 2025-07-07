import { NextFunction, Request, Response } from 'express';
import { userRepo } from '../../../../infrastructure/repositories/userRepo';
import { forgotPasswordSchema, loginSchema, registerSchema } from '@bro/shared';
import {
  combinedOtpPasswordAndRegisterSchema,
  combinedOtpPasswordAndResetSchema,
} from '../../../../domain/entities/auth';
import { resetForgotPassword } from '../../../../application/useCases/auth/resetForgotPassword';
import { sendOtp } from '../../../../application/services/auth/sendOtp';
import AppError from '../../../../infrastructure/errors/AppError';
import { registerUser } from '../../../../application/useCases/auth/registerUser';
import { createUser } from '../../../../application/useCases/auth/createUser';
import { validateLogin } from '../../../../application/useCases/auth/validateLogin';
import { socialAuthHandler } from '../../../../application/useCases/auth/socialAuthHandler';
import { forgotPasswordOtp } from '../../../../application/useCases/auth/forgotPasswordOtp';
import { verifyAndResendTokens } from '../../../../application/useCases/auth/verifyAndResendTokens';
import { logoutHelper } from '../../../../application/useCases/auth/logoutHelper';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.format() });
      return;
    }

    const { email } = parsed.data;
    const repo = new userRepo();
    await registerUser(email, repo);
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
};

export const otpAndPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = combinedOtpPasswordAndRegisterSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.format() });
      return;
    }

    const repo = new userRepo();
    await createUser(parsed.data, repo);
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
};

export const resendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    await sendOtp(email);
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.format() });
      return;
    }
    const repo = new userRepo();
    const user = await validateLogin(res, parsed.data, repo);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

export const socialRegisterOrLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, name } = req.user as { email: string; name: string };
    if (!email || !name) throw new AppError('Something went wrong', 404);
    const repo = new userRepo();
    const user = await socialAuthHandler(res, email, name, repo);
    if (user?.role === 'user') {
      res.redirect(
        `${process.env.CLIENT_URL}/?user=${encodeURIComponent(
          JSON.stringify(user)
        )}`
      );
    } else {
      res.redirect(
        `${process.env.CLIENT_URL}/admin/dashboard?user=${encodeURIComponent(
          JSON.stringify(user)
        )}`
      );
    }
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.format() });
      return;
    }

    const { email } = parsed.data;
    const repo = new userRepo();
    await forgotPasswordOtp(email, repo);
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = combinedOtpPasswordAndResetSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.format() });
      return;
    }

    const repo = new userRepo();
    await resetForgotPassword(parsed.data, repo);
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
};

export const refreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken) {
      console.log('Refresh token missing');
      res.status(401).json({ message: 'Refresh token missing' });
      return;
    }
    const success = verifyAndResendTokens(res, refreshToken);
    if (!success) {
      res.status(403).json({ message: 'Invalid or expired refresh token' });
      return;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id as string;
    logoutHelper(res ,userId);
  } catch (err) {
    next(err);
  }
};
