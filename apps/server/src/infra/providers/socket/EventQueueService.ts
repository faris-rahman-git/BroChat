import {
  emitToUserWithTimerType,
  EmitWithQueueType,
} from '../../../app/dtos/socketTypes';
import { IEventQueueService } from '../../../app/providers/socket/IEventQueueService';
import { IConversationReadRepo } from '../../../app/repositories/conversation/IConversationReadRepo';
import { IOfflineQueueRepo } from '../../../app/repositories/redis/IOfflineQueueRepo';
import { ITypingQueueRepo } from '../../../app/repositories/redis/ITypingQueueRepo';
import { IUserManagementRepo } from '../../../app/repositories/redis/IUserManagementRepo';
import { IUserReadRepo } from '../../../app/repositories/user/IUserReadRepo';

import { io } from '../../../main';
import { SearchResultType } from '@bro/shared';

export class EventQueueService implements IEventQueueService {
  constructor(
    private offlineQueueRepo: IOfflineQueueRepo,
    private typingQueueRepo: ITypingQueueRepo,
    private userManagementRepo: IUserManagementRepo,
    private conReadRepo: IConversationReadRepo,
    private UserReadRepo: IUserReadRepo
  ) {}

  private async optimizeTypingAndQueue(
    userId: string,
    event: string,
    data: any
  ): Promise<void> {
    if (
      event === 'typing-status' &&
      typeof data?.status === 'boolean' &&
      typeof data?.senderId === 'string'
    ) {
      const { senderId, status } = data;
      const queue = await this.offlineQueueRepo.getAllQueuedEvents(userId);

      if (status === false) {
        // Case: stop-typing
        const index = queue.findIndex(
          (item) =>
            item.event === 'typing-status' &&
            item.data?.status === true &&
            item.data?.senderId === senderId
        );

        if (index !== -1) {
          queue.splice(index, 1); // remove matching start-typing
          await this.offlineQueueRepo.overwriteQueue(userId, queue);
          return; // skip stop-typing
        }

        // Also prevent duplicate stop-typing
        const alreadyQueuedStop = queue.some(
          (item) =>
            item.event === 'typing-status' &&
            item.data?.status === false &&
            item.data?.senderId === senderId
        );

        if (alreadyQueuedStop) {
          return; // skip duplicate stop-typing
        }
      } else {
        // Case: start-typing

        // First check if a matching stop-typing is already queued — cancel both
        const stopIndex = queue.findIndex(
          (item) =>
            item.event === 'typing-status' &&
            item.data?.status === false &&
            item.data?.senderId === senderId
        );

        if (stopIndex !== -1) {
          queue.splice(stopIndex, 1); // remove stop-typing
          await this.offlineQueueRepo.overwriteQueue(userId, queue);
        }

        // Prevent duplicate start-typing
        const alreadyQueuedStart = queue.some(
          (item) =>
            item.event === 'typing-status' &&
            item.data?.status === true &&
            item.data?.senderId === senderId
        );

        if (alreadyQueuedStart) {
          return; // skip duplicate start-typing
        }
      }
    }

    await this.offlineQueueRepo.addEventToQueue(userId, event, data);
  }

  private async emitToUserWithTimer({
    socketId,
    event,
    data,
  }: emitToUserWithTimerType): Promise<boolean> {
    const targetSocket = io.sockets.sockets.get(socketId);
    if (!targetSocket) return false;

    const ackReceived = new Promise<boolean>((resolve) => {
      let isAcked = false;

      // Start a timeout
      const timeout = setTimeout(() => {
        if (!isAcked) resolve(false);
      }, 5000);

      targetSocket.emit(event, data, (ack: boolean) => {
        isAcked = true;
        clearTimeout(timeout);
        resolve(ack);
      });
    });

    return ackReceived;
  }

  async emitWithQueue({
    userId,
    event,
    data,
    isDirect,
  }: EmitWithQueueType): Promise<void> {
    try {
      const socketId = await this.userManagementRepo.findSocketByUserId(userId);

      if (!socketId) {
        await this.optimizeTypingAndQueue(userId, event, data);
        return;
      }

      const ackReceived = await this.emitToUserWithTimer({
        socketId,
        event,
        data,
      });

      if (!ackReceived) {
        await this.optimizeTypingAndQueue(userId, event, data);
        if (isDirect) await this.sendPending(userId);
      }
    } catch (err) {
      await this.optimizeTypingAndQueue(userId, event, data);
    }
  }

  async sendPending(userId: string): Promise<void> {
    while (true) {
      const length = await this.offlineQueueRepo.getQueueLength(userId);
      if (length === 0) break;

      let rawItem = await this.offlineQueueRepo.removeFirstEvent(userId);

      if (!rawItem) break;

      const { event, data } = rawItem;
      await this.emitWithQueue({ userId, event, data, isDirect: false });
    }
  }

  async notifyPresence(userId: string, isOnline: boolean): Promise<void> {
    // mark as online
    const userChatList = await this.conReadRepo.findDMsIds(userId);

    await Promise.all(
      userChatList.map((id) =>
        this.emitWithQueue({
          userId: id,
          event: isOnline ? 'user-online' : 'user-offline',
          data: userId,
          isDirect: true,
        })
      )
    );

    if (!isOnline) {
      const typingReceivers = await this.typingQueueRepo.getAllTypingReceivers(
        userId
      );

      for (const receiverId of typingReceivers) {
        await this.emitWithQueue({
          userId: receiverId,
          event: 'typing-status',
          data: {
            senderId: userId,
            status: false,
          },
          isDirect: true,
        });
      }

      // Clean up typing queue in Redis
      await this.typingQueueRepo.clearTypingQueue(userId);
    }
  }

  async disconnectSocket(userId: string): Promise<void> {

    const socketId = await this.userManagementRepo.findSocketByUserId(userId);

    if (socketId) {
      await this.notifyPresence(userId as string, false);
      io.to(socketId).disconnectSockets(true);
    }
  }

  async emitNewUser(
    userId: string,
    receiverId: string,
    conversationId: string
  ): Promise<void> {
    const userDetails = await this.UserReadRepo.findDetailsById(userId);
    const receiverDetails = await this.UserReadRepo.findDetailsById(receiverId);

    const senderSocketId = await this.userManagementRepo.findSocketByUserId(
      userId
    );
    const receiverSocketId = await this.userManagementRepo.findSocketByUserId(
      receiverId
    );

    const senderPayload: SearchResultType = {
      ...userDetails,
      conversationId,
      receiverId: userId,
      isOnline: !!senderSocketId,
    };

    const receiverPayload: SearchResultType = {
      ...receiverDetails,
      conversationId,
      receiverId,
      isOnline: !!receiverSocketId,
    };

    await this.emitWithQueue({
      userId: receiverId,
      event: 'new-user-chat',
      data: senderPayload,
      isDirect: true,
    });
    await this.emitWithQueue({
      userId: userId,
      event: 'new-user-chat',
      data: receiverPayload,
      isDirect: true,
    });
  }
}
