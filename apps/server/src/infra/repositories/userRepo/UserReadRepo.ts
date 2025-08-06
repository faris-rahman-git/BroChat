import { FilterQuery } from 'mongoose';

import { IUserReadRepo } from '../../../app/repositories/user/IUserReadRepo';
import userModel from '../../databases/mongo/db/userModel';
import {
  MainAllUsersListType,
  GroupMember,
  userDetailsType,
} from '@bro/shared';
import {
  FindEmailType,
  SearchRawType,
} from '../../../domain/dtos/user/UserRepoTypes';

export class UserReadRepo implements IUserReadRepo {
  async findEmail(email: string): Promise<FindEmailType | null> {
    const result = await userModel
      .findOne(
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
      )
      .lean();

    if (!result) return null;

    return {
      _id: result._id.toString(),
      name: result.name,
      email: result.email,
      password: result.password,
      role: result.role,
      isBlocked: result.isBlocked,
      isDeleted: result.isDeleted,
    };
  }

  async findUserDetailsById(userId: string): Promise<userDetailsType> {
    const result = await userModel
      .findOne(
        { _id: userId },
        {
          _id: 1,
          name: 1,
          username: 1,
          phoneNumber: 1,
          avatar: 1,
          about: 1,
          email: 1,
          blockedUsers: 1,
          role: 1,
          isSubscribed: 1,
          subscriptionPlan: 1,
          subscriptionStart: 1,
          subscriptionEnd: 1,
        }
      )
      .populate({
        path: 'blockedUsers',
        select: '_id name avatar username',
        options: { strictPopulate: false },
      })
      .lean();

    if (!result) throw new Error('User not found');

    return {
      id: result._id.toString(),
      name: result.name,
      username: result.username,
      phoneNumber: result.phoneNumber,
      avatar: result.avatar,
      about: result.about,
      email: result.email,
      blockedUsers: (result.blockedUsers ?? []).map((user: any) => ({
        _id: user._id.toString(),
        name: user.name,
        avatar: user.avatar,
        username: user.username,
      })),
      role: result.role,
      isSubscribed: result.isSubscribed,
      subscriptionPlan: result.subscriptionPlan,
      subscriptionStart: result.subscriptionStart,
      subscriptionEnd: result.subscriptionEnd,
    };
  }

  async findUsername(username: string): Promise<string | null> {
    const result = await userModel.findOne({ username }, { _id: 1 });
    return result ? result._id.toString() : null;
  }

  async findMatchUsers(
    searchData: string,
    userId: string
  ): Promise<SearchRawType[]> {
    const result = await userModel
      .find(
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
          about: 1,
          phoneNumber: 1,
          createdAt: 1,
          blockedUsers: 1,
          blockedByUsers: 1,
          isSubscribed: 1,
        }
      )
      .lean();

    return result.map((user) => ({
      _id: user._id.toString(),
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      email: user.email,
      about: user.about,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt,
      isSubscribed: user.isSubscribed,
      blockedUsers: (user.blockedUsers ?? []).map((id: any) => String(id)),
      blockedByUsers: (user.blockedByUsers ?? []).map((id: any) => String(id)),
    }));
  }

  async findDetailsById(userId: string): Promise<Omit<SearchRawType, '_id'>> {
    const result = (await userModel
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
          about: 1,
          blockedUsers: 1,
          blockedByUsers: 1,
        }
      )
      .lean())!;

    return {
      name: result.name,
      username: result.username,
      avatar: result.avatar,
      email: result.email,
      phoneNumber: result.phoneNumber,
      createdAt: result.createdAt,
      about: result.about,
      blockedUsers: (result.blockedUsers ?? []).map((id) => id.toString()),
      blockedByUsers: (result.blockedByUsers ?? []).map((id) => id.toString()),
    };
  }

  async findAllUsersWithSearch(
    query: FilterQuery<any>,
    page: number
  ): Promise<MainAllUsersListType> {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const [user, countResult] = await Promise.all([
      userModel
        .find(query, {
          _id: 1,
          username: 1,
          email: 1,
          isBlocked: 1,
          blockedAt: 1,
          createdAt: 1,
          name: 1,
          phoneNumber: 1,
          avatar: 1,
          isDeleted: 1,
          deletedAt: 1,
          deletedBy: 1,
          isSubscribed: 1,
          subscriptionPlan: 1,
          subscriptionStart: 1,
          subscriptionEnd: 1,
        })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      userModel.countDocuments(query),
    ]);

    const userData = user.map((userDoc) => ({
      _id: userDoc._id.toString(),
      username: userDoc.username,
      email: userDoc.email,
      isBlocked: userDoc.isBlocked,
      blockedAt: userDoc.blockedAt,
      createdAt: userDoc.createdAt,
      name: userDoc.name,
      phoneNumber: userDoc.phoneNumber,
      avatar: userDoc.avatar,
      isDeleted: userDoc.isDeleted,
      deletedAt: userDoc.deletedAt,
      deletedBy: userDoc.deletedBy,
      isSubscribed: userDoc.isSubscribed,
      subscriptionPlan: userDoc.subscriptionPlan,
      subscriptionStart: userDoc.subscriptionStart,
      subscriptionEnd: userDoc.subscriptionEnd,
    }));

    return {
      data: userData,
      totalPages: Math.ceil(countResult / pageSize),
    };
  }

  async findDeletedUsers(
    searchValue: string,
    page: number
  ): Promise<MainAllUsersListType> {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const filter = {
      $or: [
        { email: { $regex: searchValue, $options: 'i' } },
        { username: { $regex: searchValue, $options: 'i' } },
      ],
      role: 'user',
      isDeleted: true,
    };

    const [user, countResult] = await Promise.all([
      userModel
        .find(filter, {
          _id: 1,
          username: 1,
          email: 1,
          isBlocked: 1,
          blockedAt: 1,
          createdAt: 1,
          name: 1,
          phoneNumber: 1,
          avatar: 1,
          isDeleted: 1,
          deletedAt: 1,
          deletedBy: 1,
        })
        .sort({ deletedAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      userModel.countDocuments(filter),
    ]);

    const userData = user.map((userDoc) => ({
      _id: userDoc._id.toString(),
      username: userDoc.username,
      email: userDoc.email,
      isBlocked: userDoc.isBlocked,
      blockedAt: userDoc.blockedAt,
      createdAt: userDoc.createdAt,
      name: userDoc.name,
      phoneNumber: userDoc.phoneNumber,
      avatar: userDoc.avatar,
      isDeleted: userDoc.isDeleted,
      deletedAt: userDoc.deletedAt,
      deletedBy: userDoc.deletedBy,
    }));

    return {
      data: userData,
      totalPages: Math.ceil(countResult / pageSize),
    };
  }

  async getUsersMinimalDetails(userIds: string[]): Promise<GroupMember[]> {
    const users = await userModel
      .find(
        { _id: { $in: userIds } },
        { _id: 1, name: 1, avatar: 1, username: 1 }
      )
      .lean();

    return users.map((u) => ({
      _id: String(u._id),
      name: u.name,
      avatar: u.avatar,
      username: u.username,
    }));
  }

  async findIsSubscribed(userId: string): Promise<boolean> {
    const result = await userModel
      .findOne(
        { _id: userId },
        {
          isSubscribed: 1,
        }
      )
      .lean();

    return result!.isSubscribed;
  }

  async findExpiredSubscriptionsUserId(): Promise<string[]> {
    const result = await userModel
      .find(
        { isSubscribed: true, subscriptionEnd: { $lt: new Date() } },
        { _id: 1 }
      )
      .lean();

    return result.map((u) => String(u._id));
  }
}
