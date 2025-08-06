import { IUserDeleteRepo } from '../../../app/repositories/user/IUserDeleteRepo';
import userModel from '../../databases/mongo/db/userModel';

export class UserDeleteRepo implements IUserDeleteRepo {
  async updateSoftDeleteStatus(
    userId: string,
    isDeleted: boolean,
    deletedBy: string
  ): Promise<void> {
    await userModel.findByIdAndUpdate(userId, {
      isDeleted,
      deletedAt: isDeleted ? Date.now() : null,
      deletedBy: isDeleted ? deletedBy : null,
    });
  }

  async deleteUser(userId: string): Promise<void> {
    await userModel.findByIdAndDelete(userId);
  }
}
