export interface IWebLeaveRoomUseCase {
  execute(roomId: string, leaver: string): Promise<boolean>;
}
