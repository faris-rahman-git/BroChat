import {
  forgotPasswordSchema,
  otpAndPasswordBaseSchema,
  registerSchema,
} from '@bro/shared';

export const combinedOtpPasswordAndRegisterSchema = otpAndPasswordBaseSchema
  .merge(registerSchema)
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const combinedOtpPasswordAndResetSchema = otpAndPasswordBaseSchema
  .merge(forgotPasswordSchema)
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type saveUserType = {
  name: string;
  username: string;
  email: string;
  phoneNumber?: string;
  password?: string;
};

export type otpAndPasswordBodyType = Required<
  Omit<saveUserType, 'username'>
> & {
  otp: string;
  confirmPassword: string;
};
