import { Response } from 'express';
import { clearToken } from '../../services/auth/clearToken';
import { disconnectSocket } from '../../services/socket/disconnectSocket';
export const logoutHelper = (res: Response, userId: string) => {
  clearToken(res);
  disconnectSocket(userId);
};
