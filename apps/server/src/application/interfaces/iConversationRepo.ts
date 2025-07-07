import {
  CheckConversationExistsType,
  CreateNewConversationType,
  FindReceiverIdType,
} from '../../domain/entities/conversationTypes';
import { usersList } from '../../domain/entities/homeTypes';

export interface iConversationRepo {
  findDMs(userId: string): Promise<usersList[]>;
  findDMsIds(userId: string): Promise<string[]>;
  findReceiverId(conversationId: string): Promise<FindReceiverIdType>;
  checkConversationExists(
    userId: string,
    receiverId: string
  ): Promise<CheckConversationExistsType | null>;
  createNewConversation(
    userId: string,
    receiverId: string
  ): Promise<CreateNewConversationType>;
}
