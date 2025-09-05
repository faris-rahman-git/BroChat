import { callInfoType } from '@bro/shared';
export interface ICallRoomRepo {
  saveUser(
    userId: string,
    name: string,
    avatar: string,
    isVideoCall: boolean,
    audio?: boolean
  ): Promise<void>;
  getUser(userId: string): Promise<callInfoType | null>;
  deleteUser(userId: string): Promise<void>;

  addUserToRoom(roomId: string, userId: string): Promise<void>;
  removeUserFromRoom(roomId: string, userId: string): Promise<void>;
  getRoomMembers(roomId: string): Promise<string[]>;
}
