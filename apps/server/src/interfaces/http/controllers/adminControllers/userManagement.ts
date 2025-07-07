import { Request, Response, NextFunction } from 'express';
import { userRepo } from '../../../../infrastructure/repositories/userRepo';
import { getAllUsersHelper } from '../../../../application/useCases/admin/userManagement/getAllUsersHelper';
import { getDeletedUsersHelper } from '../../../../application/useCases/admin/userManagement/getDeletedUsersHelper';
import { userBlockManagementHelper } from '../../../../application/useCases/admin/userManagement/userBlockManagementHelper';
import { softDeleteUserHelper } from '../../../../application/useCases/admin/userManagement/softDeleteUserHelper';
import { restoreUserHelper } from '../../../../application/useCases/admin/userManagement/restoreUserHelper';
import { hardDeleteUserHelper } from '../../../../application/useCases/admin/userManagement/hardDeleteUserHelper';

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { searchValue, status, joinedAt } = req.query;
    const repo = new userRepo();
    const usersList = await getAllUsersHelper(
      repo,
      searchValue as string,
      status as string,
      joinedAt as string
    );
    res.status(200).json({ usersList });
  } catch (err) {
    next(err);
  }
};

export const userBlockManagement = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, isBlocked, searchValue, status, joinedAt } = req.body;
    const repo = new userRepo();
    const updatedUsersList = await userBlockManagementHelper(
      repo,
      userId,
      isBlocked,
      searchValue,
      status,
      joinedAt
    );
    res.status(200).json({ updatedUsersList });
  } catch (err) {
    next(err);
  }
};

export const softDeleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, searchValue, status, joinedAt } = req.body;
    const repo = new userRepo();
    const updatedUsersList = await softDeleteUserHelper(
      repo,
      userId,
      searchValue,
      status,
      joinedAt
    );
    res.status(200).json({ updatedUsersList });
  } catch (err) {
    next(err);
  }
};

export const getDeletedUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const searchValue = req.query.searchValue ?? '';
    const repo = new userRepo();
    const usersList = await getDeletedUsersHelper(repo, searchValue as string);
    res.status(200).json({ usersList });
  } catch (err) {
    next(err);
  }
};

export const restoreUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, searchValue } = req.body;
    const repo = new userRepo();
    const updatedUsersList = await restoreUserHelper(repo, userId, searchValue);
    res.status(200).json({ updatedUsersList });
  } catch (err) {
    next(err);
  }
};

export const hardDeleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const searchValue = req.query.searchValue ?? '';

    const repo = new userRepo();
    const updatedUsersList = await hardDeleteUserHelper(
      repo,
      userId,
      searchValue as string
    );
    res.status(200).json({ updatedUsersList });
  } catch (err) {
    next(err);
  }
};
