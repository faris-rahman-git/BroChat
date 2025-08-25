import { ProfileUpdateInfoParams } from '@bro/shared';
import {
  SaveUserInputType,
  SaveUserOutputType,
} from '../../../domain/dtos/user/UserRepoTypes';

export interface IUserWriteRepo {
  saveUser(user: SaveUserInputType): Promise<SaveUserOutputType>;
  updateUserPassword(email: string, newPassword: string): Promise<void>;
  updateBlockStatus(userId: string, isBlocked: boolean): Promise<void>;
  updateSoftDeleteStatus(
    userId: string,
    isDeleted: boolean,
    deletedBy: string
  ): Promise<void>;
  blockUser(userId: string, receiverId: string): Promise<void>;
  unblockUser(userId: string, receiverId: string): Promise<void>;
  updateSubscriptionDetails(
    userId: string,
    isSubscribed: boolean,
    subscriptionPlan: string | null,
    subscriptionStart: Date | null | string,
    subscriptionEnd: Date | null | string
  ): Promise<void>;
  updateProfileInfo(
    userId: string,
    profileInfo: ProfileUpdateInfoParams
  ): Promise<void>;

  makeUserAsExclusive(userId: string): Promise<void>;
}
