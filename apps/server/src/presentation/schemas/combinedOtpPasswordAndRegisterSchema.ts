import { otpAndPasswordBaseSchema, registerSchema } from '@bro/shared';

export const combinedOtpPasswordAndRegisterSchema = otpAndPasswordBaseSchema
  .merge(registerSchema)
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
