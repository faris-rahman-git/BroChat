import { Response } from 'express';
export const clearToken = (res: Response) => {
  res
    .clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    })
    .clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    })
    .status(200)
    .json({});
};
