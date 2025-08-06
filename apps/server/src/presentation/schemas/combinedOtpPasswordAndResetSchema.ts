import { otpAndPasswordBaseSchema, forgotPasswordSchema } from '@bro/shared';

export const combinedOtpPasswordAndResetSchema = otpAndPasswordBaseSchema
  .merge(forgotPasswordSchema)
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
