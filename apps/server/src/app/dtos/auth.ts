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

export type ResetPasswordType = Omit<otpAndPasswordBodyType, 'name' | 'phoneNumber' | 'username'>

export type SocialRegisterOrLoginType = {
  email: string;
  name: string;
}