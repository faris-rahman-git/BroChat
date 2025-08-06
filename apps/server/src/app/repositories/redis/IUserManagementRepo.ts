export interface IUserManagementRepo {
  findSocketByUserId(userId: string): Promise<string | null>;

  saveUserToRedis(socketId: string, userId: string): Promise<void>;

  removeUserBySocketId(socketId: string): Promise<string | null>;
}
