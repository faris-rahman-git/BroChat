import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { ZegoServerService } from '../../../../../infra/providers/user/ZegoServerService';
import { ICallTokenUseCase } from '../interfaces/ICallTokenUseCase';

export class CallTokenUseCase implements ICallTokenUseCase {
  constructor(private zegoServerService: ZegoServerService) {}

  async execute(userId: string): Promise<ResponseDTO> {
    try {
      const effectiveTimeInSeconds = 3600;
      const payload = '';
      const appID = Number(process.env.ZEGO_APP_ID!);
      const token = this.zegoServerService.generateToken04(
        appID,
        userId,
        process.env.ZEGO_SERVER_SECRET!,
        effectiveTimeInSeconds,
        payload
      );

      return {
        success: true,
        data: {
          token,
          appID,
        },
      };
    } catch (err: any) {
      console.log('Error in CallTokenUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
