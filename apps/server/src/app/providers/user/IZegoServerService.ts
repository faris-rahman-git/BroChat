export interface IZegoServerService {
  generateToken04(
    appId: number,
    userId: string,
    secret: string,
    effectiveTimeInSeconds: number,
    payload?: string
  ): string;
}
