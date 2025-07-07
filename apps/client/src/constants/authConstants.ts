import { InputList } from "../types/authTypes";
import { type RegisterSchemaType } from "@bro/shared";
import type { OtpAndPasswordSchemaType } from "@bro/shared";
import type { LoginSchemaType } from "@bro/shared";
import type { ForgotPasswordSchemaType } from "@bro/shared";

export const registerFormFields: InputList<RegisterSchemaType> = [
  {
    type: "text",
    title: "Name",
    placeholder: "Enter Your Name",
    name: "name",
  },
  {
    type: "email",
    title: "Email",
    placeholder: "Enter Your Email",
    name: "email",
  },
  {
    type: "number",
    title: "Phone Number",
    placeholder: "Enter Your Phone Number",
    name: "phoneNumber",
  },
];

export const otpAndPasswordFormFields: InputList<OtpAndPasswordSchemaType> = [
  {
    type: "number",
    title: "OTP",
    placeholder: "Enter Your OTP",
    name: "otp",
  },
  {
    type: "password",
    title: "Password",
    placeholder: "Enter Your Password",
    name: "password",
  },
  {
    type: "password",
    title: "Confirm Password",
    placeholder: "Confirm Your Password",
    name: "confirmPassword",
  },
];

export const loginFormFields: InputList<LoginSchemaType> = [
  {
    type: "email",
    title: "Email",
    placeholder: "Enter Your Email",
    name: "email",
  },
  {
    type: "password",
    title: "Password",
    placeholder: "Enter Your Password",
    name: "password",
  },
];

export const forgotPasswordFormFields: InputList<ForgotPasswordSchemaType> = [
  {
    type: "email",
    title: "Email",
    placeholder: "Enter Your Email For Reset Code",
    name: "email",
  },
];
