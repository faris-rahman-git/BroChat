import userModel from '../../databases/mongo/db/userModel';
import { IUserWriteRepo } from '../../../app/repositories/user/IUserWriteRepo';
import { ProfileUpdateInfoParams } from '@bro/shared';
import {
  SaveUserInputType,
  SaveUserOutputType,
} from '../../../domain/dtos/user/UserRepoTypes';

export class UserWriteRepo implements IUserWriteRepo {
  async saveUser(user: SaveUserInputType): Promise<SaveUserOutputType> {
    const createdUser = await userModel.create(user);
    const { _id, name, email, password, role } = createdUser.toObject();
    return { _id: _id.toString(), name, email, password, role };
  }

  async updateUserPassword(email: string, newPassword: string): Promise<void> {
    await userModel.findOneAndUpdate(
      { email },
      { $set: { password: newPassword } },
      { new: true }
    );
  }

  async updateBlockStatus(userId: string, isBlocked: boolean): Promise<void> {
    await userModel.findByIdAndUpdate(userId, {
      isBlocked,
      blockedAt: isBlocked ? Date.now() : null,
    });
  }

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

  async blockUser(userId: string, receiverId: string): Promise<void> {
    await userModel.findByIdAndUpdate(userId, {
      $addToSet: { blockedUsers: receiverId },
    });
    await userModel.findByIdAndUpdate(receiverId, {
      $addToSet: { blockedByUsers: userId },
    });
  }

  async unblockUser(userId: string, receiverId: string): Promise<void> {
    await userModel.findByIdAndUpdate(userId, {
      $pull: { blockedUsers: receiverId },
    });
    await userModel.findByIdAndUpdate(receiverId, {
      $pull: { blockedByUsers: userId },
    });
  }

  async updateSubscriptionDetails(
    userId: string,
    isSubscribed: boolean,
    subscriptionPlan: string | null,
    subscriptionStart: Date | null | string,
    subscriptionEnd: Date | null | string
  ): Promise<void> {
    await userModel.findByIdAndUpdate(userId, {
      isSubscribed,
      subscriptionPlan,
      subscriptionStart,
      subscriptionEnd,
    });
  }

  async updateProfileInfo(
    userId: string,
    profileInfo: ProfileUpdateInfoParams
  ): Promise<void> {
    await userModel.findByIdAndUpdate(userId, profileInfo);
  }
}
