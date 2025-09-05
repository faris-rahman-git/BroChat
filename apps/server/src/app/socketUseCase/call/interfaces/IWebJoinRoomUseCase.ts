export interface IWebJoinRoomUseCase {
  execute(
    userId: string,
    roomId: string,
    isVideoCall: boolean
  ): Promise<boolean>;
}
