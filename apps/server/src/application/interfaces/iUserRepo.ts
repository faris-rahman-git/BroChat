import { AllUsersType, DeletedUserListType } from '@bro/shared';
import { saveUserType } from '../../domain/entities/auth';
import { SearchRawType } from '../../domain/entities/homeTypes';
import {
  FindEmailAndSaveUserType,
  FindUsernameType,
} from '../../domain/entities/userModelTypes';
import { FilterQuery } from 'mongoose';

export interface iUserRepo {
  findEmail(email: string): Promise<FindEmailAndSaveUserType | null>;
  findUsername(username: string): Promise<FindUsernameType | null>;
  saveUser(user: saveUserType): Promise<FindEmailAndSaveUserType>;
  updateUserPassword(email: string, newPassword: string): Promise<void>;
  findMatchUsers(searchData: string, userId: string): Promise<SearchRawType[]>;
  findDetailsById(userId: string): Promise<Omit<SearchRawType, '_id'>>;
  findAllUsersWithSearch(query: FilterQuery<any>): Promise<AllUsersType[]>;
  findDeletedUsers(searchValue: string): Promise<DeletedUserListType[]>;
  updateBlockStatus(userId: string, isBlocked: boolean): Promise<void>;
  updateSoftDeleteStatus(
    userId: string,
    isDeleted: boolean,
    deletedBy: string
  ): Promise<void>;
  deleteUser(userId: string): Promise<void>;
}
