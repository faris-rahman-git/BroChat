import { IReceiver, IUserRef } from '../../domain/entity/user/CallTypes';
import {  Types } from 'mongoose';

export interface ICallDocumentPopulated {
  conversationId: Types.ObjectId;
  caller: IUserRef;
  receivers: IReceiver[];
  roomId: string;
  isVideoCall: boolean;
  isGroupCall: boolean;
  initiatedAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  duration?: number;
}
