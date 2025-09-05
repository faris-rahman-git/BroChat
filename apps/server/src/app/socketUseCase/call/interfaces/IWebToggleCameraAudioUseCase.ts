export interface IWebToggleCameraAudioUseCase {
  execute(
    roomId: string,
    switchTarget: 'video' | 'audio',
    userId: string
  ): Promise<boolean>;
}
