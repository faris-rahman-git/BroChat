export interface IUserDeleteRepo {
  updateSoftDeleteStatus(
    userId: string,
    isDeleted: boolean,
    deletedBy: string
  ): Promise<void>;
  deleteUser(userId: string): Promise<void>;
}
