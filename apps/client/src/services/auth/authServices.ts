import { RegisterData } from '@client/types/authTypes';
import type {
  ForgotPasswordSchemaType,
  LoginSchemaType,
  RegisterSchemaType,
  OtpAndPasswordSchemaType,
} from '@bro/shared';
import api from '@client/configs/axios';

export const registerApi = async (data: RegisterSchemaType) => {
  const res = await api.post('/register', data);
  return res.data;
};

export const otpAndPasswordApi = async ({
  data,
  mode,
}: {
  data: OtpAndPasswordSchemaType & RegisterData;
  mode: string;
}) => {
  if (mode === 'register') {
    const res = await api.post('/otpandpassword', data);
    return res.data;
  }
  if (mode === 'forgot') {
    const res = await api.put('/resetpassword', data);
    return res.data;
  }
};

export const useResendOtpApi = async (email: string) => {
  const res = await api.post('/resendotp', { email });
  return res.data;
};

export const loginApi = async (data: LoginSchemaType) => {
  const res = await api.post('/login', data);
  return res.data;
};

export const forgotPasswordApi = async (data: ForgotPasswordSchemaType) => {
  const res = await api.post('/forgotpassword', data);
  return res.data;
};

export const logoutApi = async () => {
  const res = await api.get('/logout');
  return res.data;
};
