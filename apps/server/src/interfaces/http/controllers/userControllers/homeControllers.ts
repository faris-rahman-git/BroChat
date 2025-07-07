import { NextFunction, Request, Response } from 'express';
import { searchSchema } from '../../../../schemas/home/searchSchema';
import { userRepo } from '../../../../infrastructure/repositories/userRepo';
import { findMatchUsers } from '../../../../application/useCases/home/findMatchUsers';
import { getChatList } from '../../../../application/useCases/home/getChatList';
import { conversationRepo } from '../../../../infrastructure/repositories/conversationRepo';
import { messagesHelper } from '../../../../application/useCases/home/messagesHelper';
import { messageRepo } from '../../../../infrastructure/repositories/messageRepo';
import { createNewConversationHelper } from '../../../../application/useCases/home/createNewConversationHelper';
import { MessageType, SearchResultType } from '@bro/shared';

export const searchUser = async (
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
    const repo = new userRepo();
    const conRepo = new conversationRepo();
    const MatchedUsers: SearchResultType[] = await findMatchUsers(
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

export const createNewConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: string = req.user?.id as string;
    const receiverId: string = req.body.receiverId;
    const conRepo = new conversationRepo();
    const repo = new userRepo();
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

export const chatList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id as string;
    const repo = new conversationRepo();
    const usersList: SearchResultType[] = await getChatList(repo, userId);
    res.status(200).json({ usersList });
  } catch (err) {
    next(err);
  }
};

export const getPrevMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { conversationId } = req.params;
    const messRepo = new messageRepo();

    const messages: MessageType[] = await messagesHelper(
      conversationId,
      messRepo
    );
    res.status(200).json({ messages });
  } catch (err) {
    next(err);
  }
};
