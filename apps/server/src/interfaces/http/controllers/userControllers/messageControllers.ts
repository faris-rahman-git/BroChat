import { NextFunction, Request, Response } from 'express';
import { DeleteMessageType, MessageType } from '@bro/shared';
import { messagesHelper } from '../../../../application/useCases/home/messageUseCases/messagesHelper';
import { messageRepo } from '../../../../infrastructure/repositories/messageRepo';
import { deleteMessageHelper } from '../../../../application/useCases/home/messageUseCases/deleteMessageHelper';
import { conversationRepo } from '../../../../infrastructure/repositories/conversationRepo';

const messRepo = new messageRepo();
const conRepo = new conversationRepo();

export const getPrevMessagesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user?.id as string;
    const messages: MessageType[] = await messagesHelper(
      messRepo,
      conversationId,
      userId
    );
    res.status(200).json({ messages });
  } catch (err) {
    next(err);
  }
};

export const deleteMessageHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { messageId, conversationId } = req.params;
    const type = req.query.type as DeleteMessageType;
    const userId = req.user?.id as string;

    await deleteMessageHelper(
      messRepo,
      conRepo,
      messageId,
      conversationId,
      userId,
      type
    );
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
};
