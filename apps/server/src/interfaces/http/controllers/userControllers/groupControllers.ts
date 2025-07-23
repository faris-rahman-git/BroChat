import { NextFunction, Request, Response } from 'express';
import { GroupChatListType } from '@bro/shared';
import { groupChatListHelper } from '../../../../application/useCases/home/groupUseCases/groupChatListHelper';
import { conversationRepo } from '../../../../infrastructure/repositories/conversationRepo';
import { createNewGroupHelper } from '../../../../application/useCases/home/groupUseCases/createNewGroupHelper';
import { removeGroupMemberHelper } from '../../../../application/useCases/home/groupUseCases/removeGroupMemberHelper';
import { userRepo } from '../../../../infrastructure/repositories/userRepo';
import { makeGroupAdminHelper } from '../../../../application/useCases/home/groupUseCases/makeGroupAdminHelper';
import { dismissGroupAdminHelper } from '../../../../application/useCases/home/groupUseCases/dismissGroupAdminHelper';
import { addGroupMembershelper } from '../../../../application/useCases/home/groupUseCases/addGroupMembershelper';
import { updateGroupInfoHelper } from '../../../../application/useCases/home/groupUseCases/updateGroupInfoHelper';

const conRepo = new conversationRepo();
const repo = new userRepo();

export const groupChatListHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id as string;
    const groupList: GroupChatListType[] = await groupChatListHelper(
      conRepo,
      userId
    );
    res.status(200).json({ groupList });
  } catch (err) {
    next(err);
  }
};

export const createNewGroupHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: string = req.user?.id as string;
    const {
      groupName,
      groupMembers,
      groupAvatarUrl,
    }: {
      groupName: string;
      groupMembers: string[];
      groupAvatarUrl: string;
    } = req.body;
    await createNewGroupHelper(
      conRepo,
      repo,
      userId,
      groupName,
      groupMembers,
      groupAvatarUrl
    );
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
};

export const removeGroupMemberHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { conversationId, memberId } = req.params;
    const userId = req.user?.id as string;
    await removeGroupMemberHelper(conRepo, conversationId, userId, memberId);
    res.status(200).json({ memberId });
  } catch (err) {
    next(err);
  }
};

export const makeGroupAdminHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { conversationId, memberId } = req.params;
    const userId = req.user?.id as string;
    await makeGroupAdminHelper(conRepo, conversationId, userId, memberId);
    res.status(200).json({ memberId });
  } catch (err) {
    next(err);
  }
};

export const dismissGroupAdminHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { conversationId, memberId } = req.params;
    const userId = req.user?.id as string;
    await dismissGroupAdminHelper(conRepo, conversationId, userId, memberId);
    res.status(200).json({ memberId });
  } catch (err) {
    next(err);
  }
};

export const addGroupMembersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { conversationId } = req.params;
    const { newMembersId } = req.body;
    const userId = req.user?.id as string;
    await addGroupMembershelper(
      conRepo,
      repo,
      conversationId,
      userId,
      newMembersId
    );
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
};

export const updateGroupInfoHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { conversationId } = req.params;
    const { groupInfo } = req.body;
    const userId = req.user?.id as string;
    await updateGroupInfoHelper(conRepo, conversationId, userId, groupInfo);
    res.status(200).json({ groupInfo });
  } catch (err) {
    next(err);
  }
};
