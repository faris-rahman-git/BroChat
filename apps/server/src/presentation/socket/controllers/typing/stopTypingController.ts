import { TypingType } from '../../../../app/dtos/socketTypes';
import { ISocketController } from '../../../../app/providers/controller/ISocketController';
import { IStopTypingUseCase } from '../../../../app/socketUseCase/typing/interfaces/IStopTypingUseCase';
import { CustomPayloadType } from '../../../../domain/dtos/auth/authTypes';
import { ISocketRequest } from '../../socketHelper/ISocketRequest';

export class stopTypingController implements ISocketController {
  constructor(private stopTypingUseCase: IStopTypingUseCase) {}

  async handle(socketRequest: ISocketRequest): Promise<any> {
    try {
      const data = socketRequest.body as TypingType;
      const { id: userId } = socketRequest.user as CustomPayloadType;
      if (!userId) return false;

      const result = await this.stopTypingUseCase.execute(data, userId);
      return result;
    } catch (error) {
      console.error('Error in stopTypingController:', error);
      return false;
    }
  }
}
