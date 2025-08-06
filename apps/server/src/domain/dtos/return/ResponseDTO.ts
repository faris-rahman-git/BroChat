export interface ResponseDTO {
  success: boolean;

  data?: any;

  statusCode?: number;

  cookies?: {
    accessToken: string;
    refreshToken: string;
  };
}
