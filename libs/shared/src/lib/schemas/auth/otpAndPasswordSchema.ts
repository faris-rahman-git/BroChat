import { z } from "zod";

export const otpAndPasswordBaseSchema = z
  .object({
    otp: z.string().length(6, "OTP must be 6 digits"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must include a lowercase letter")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/\d/, "Password must include a number")
      .regex(/[^a-zA-Z0-9]/, "Password must include a special character"),
    confirmPassword: z.string(),
  })

export const otpAndPasswordSchema = otpAndPasswordBaseSchema
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type OtpAndPasswordSchemaType = z.infer<typeof otpAndPasswordSchema>;