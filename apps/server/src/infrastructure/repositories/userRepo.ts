import { FilterQuery } from 'mongoose';
import { iUserRepo } from '../../application/interfaces/iUserRepo';
import { saveUserType } from '../../domain/entities/auth';
import { SearchRawType } from '../../domain/entities/homeTypes';
import {
  FindEmailAndSaveUserType,
  FindUsernameType,
} from '../../domain/entities/userModelTypes';
import userModel from '../database/userModel';
import { AllUsersType, DeletedUserListType } from '@bro/shared';

export class userRepo implements iUserRepo {
  async findEmail(email: string): Promise<FindEmailAndSaveUserType | null> {
    return await userModel.findOne(
      { email },
      {
        _id: 1,
        name: 1,
        email: 1,
        password: 1,
        role: 1,
        isBlocked: 1,
        isDeleted: 1,
      }
    );
  }

  async findUsername(username: string): Promise<FindUsernameType | null> {
    return await userModel.findOne({ username }, { _id: 1 });
  }

  async saveUser(user: saveUserType): Promise<FindEmailAndSaveUserType> {
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

  async findMatchUsers(
    searchData: string,
    userId: string
  ): Promise<SearchRawType[]> {
    return await userModel.find(
      {
        $and: [
          {
            $or: [
              { name: { $regex: searchData, $options: 'i' } },
              { username: { $regex: searchData, $options: 'i' } },
            ],
            _id: { $ne: userId }, // exclude self
          },
          { role: 'user' },
        ],
      },
      {
        _id: 1,
        name: 1,
        username: 1,
        avatar: 1,
        email: 1,
        phoneNumber: 1,
        createdAt: 1,
      }
    );
  }

  async findDetailsById(userId: string): Promise<Omit<SearchRawType, '_id'>> {
    return (await userModel
      .findOne(
        { _id: userId },
        {
          _id: 0,
          name: 1,
          username: 1,
          avatar: 1,
          email: 1,
          phoneNumber: 1,
          createdAt: 1,
        }
      )
      .lean())!;
  }

  async findAllUsersWithSearch(
    query: FilterQuery<any>
  ): Promise<AllUsersType[]> {
    return await userModel
      .find(query, {
        _id: 1,
        username: 1,
        email: 1,
        isBlocked: 1,
        createdAt: 1,
      })
      .lean();
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

  async deleteUser(userId: string): Promise<void> {
    await userModel.findByIdAndDelete(userId);
  }

  async findDeletedUsers(searchValue: string): Promise<DeletedUserListType[]> {
    return (await userModel
      .find(
        {
          $and: [
            {
              $or: [
                { email: { $regex: searchValue, $options: 'i' } },
                { username: { $regex: searchValue, $options: 'i' } },
              ],
            },
            { role: 'user', isDeleted: true },
          ],
        },
        {
          _id: 1,
          username: 1,
          email: 1,
          createdAt: 1,
          deletedAt: 1,
          deletedBy: 1,
        }
      )
      .lean())!;
  }
}
