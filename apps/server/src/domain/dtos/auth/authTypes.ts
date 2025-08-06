export type CustomPayloadType = {
  id: string;
  email: string;
  name?: string;
  role: string;
};

export type VerifyTokensType = {
  valid: boolean;
  decoded: CustomPayloadType | null;
};