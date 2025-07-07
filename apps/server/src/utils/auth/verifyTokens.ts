import jwt from 'jsonwebtoken';

export const verifyAccessToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
    return { valid: true, decoded };
  } catch (err) {
    return { valid: false, decoded: null };
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
    return { valid: true, decoded };
  } catch (err) {
    return { valid: false, decoded: null };
  }
};
