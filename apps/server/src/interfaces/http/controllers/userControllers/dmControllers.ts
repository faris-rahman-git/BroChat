import { NextFunction, Request, Response } from 'express';
import { ReportUserType, SearchResultType } from '@bro/shared';
import { oneToOneChatListHelper } from '../../../../application/useCases/home/dmUseCases/oneToOneChatListHelper';
import { conversationRepo } from '../../../../infrastructure/repositories/conversationRepo';
import { userRepo } from '../../../../infrastructure/repositories/userRepo';
import { searchSchema } from '../../../../schemas/home/searchSchema';
import { searchUserHelper } from '../../../../application/useCases/home/dmUseCases/searchUserHelper';
import { createNewConversationHelper } from '../../../../application/useCases/home/dmUseCases/createNewConversationHelper';
import { reportRepo } from '../../../../infrastructure/repositories/reportRepo';
import { reportUserHelper } from '../../../../application/useCases/home/dmUseCases/reportUserHelper';
import { blockUserHelper } from '../../../../application/useCases/home/dmUseCases/blockUserHelper';
import { unblockUserHelper } from '../../../../application/useCases/home/dmUseCases/unblockUserHelper';

const conRepo = new conversationRepo();
const repo = new userRepo();
const repRepo = new reportRepo();

export const oneToOneChatListHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id as string;
    const usersList: SearchResultType[] = await oneToOneChatListHelper(
      conRepo,
      userId
    );
    res.status(200).json({ usersList });
  } catch (err) {
    next(err);
  }
};

export const searchUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = searchSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.format() });
      return;
    }

    const userId = req.user?.id as string;
    const { searchData } = parsed.data;
    const MatchedUsers: SearchResultType[] = await searchUserHelper(
      repo,
      conRepo,
      searchData,
      userId
    );
    res.status(200).json({ MatchedUsers });
  } catch (err) {
    next(err);
  }
};

export const createNewConversationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: string = req.user?.id as string;
    const receiverId: string = req.body.receiverId;
    const newConversationId = await createNewConversationHelper(
      conRepo,
      repo,
      userId,
      receiverId
    );
    res.status(200).json({ newConversationId });
  } catch (err) {
    next(err);
  }
};

export const reportUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: string = req.user?.id as string;
    const { conversationId, reason, reportedUserId }: ReportUserType = req.body;
    await reportUserHelper(
      repRepo,
      userId,
      conversationId,
      reason,
      reportedUserId
    );
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
};

export const blockUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: string = req.user?.id as string;
    const { conversationId } = req.body;
    await blockUserHelper(
      repo,
      conRepo,
      userId,
      conversationId
    );
    res.status(200).json({ });
  } catch (err) {
    next(err);
  }
};


export const unblockUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: string = req.user?.id as string;
    const { conversationId } = req.body;
    await unblockUserHelper(
      repo,
      conRepo,
      userId,
      conversationId
    );
    res.status(200).json({ });
  } catch (err) {
    next(err);
  }
};