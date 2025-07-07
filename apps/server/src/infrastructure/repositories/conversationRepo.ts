import { iConversationRepo } from '../../application/interfaces/iConversationRepo';
import {
  CheckConversationExistsType,
  CreateNewConversationType,
  FindReceiverIdType,
} from '../../domain/entities/conversationTypes';
import { usersList } from '../../domain/entities/homeTypes';
import conversationModel from '../database/conversationModel';

export class conversationRepo implements iConversationRepo {
  async findDMs(userId: string): Promise<usersList[]> {
    return (await conversationModel
      .find(
        { participants: userId, isGroup: false },
        { _id: 1, participants: 1 }
      )
      .populate(
        'participants',
        '_id name avatar username email phoneNumber createdAt'
      )
      .lean()) as unknown as usersList[];
  }

  async findDMsIds(userId: string): Promise<string[]> {
    const conversations = await conversationModel
      .find(
        { participants: userId, isGroup: false },
        { _id: 0, participants: 1 }
      )
      .lean();

    const result: string[] = [];
    conversations.forEach((conv) => {
      const otherParticipant = conv.participants.find(
        (id) => id.toString() !== userId
      );
      if (otherParticipant) {
        result.push(otherParticipant.toString());
      }
    });

    return result;
  }

  async findReceiverId(conversationId: string): Promise<FindReceiverIdType> {
    return (await conversationModel.findOne(
      { _id: conversationId, isGroup: false },
      { _id: 0, participants: 1 }
    ))!;
  }

  async checkConversationExists(
    userId: string,
    receiverId: string
  ): Promise<CheckConversationExistsType | null> {
    return await conversationModel.findOne(
      {
        isGroup: false,
        participants: { $all: [userId, receiverId], $size: 2 },
      },
      {
        _id: 1,
      }
    );
  }

  async createNewConversation(
    userId: string,
    receiverId: string
  ): Promise<CreateNewConversationType> {
    const conversation = await conversationModel.create({
      participants: [userId, receiverId],
    });

    const { _id } = conversation.toObject();
    return {
      _id: _id.toString(),
    };
  }
}
