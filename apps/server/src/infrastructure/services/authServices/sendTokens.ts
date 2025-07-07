import { Response } from 'express';

export const sendTokens = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  res
    .cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      // secure: true,
      // sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 min
    })
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      // secure: true,
      // sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};
