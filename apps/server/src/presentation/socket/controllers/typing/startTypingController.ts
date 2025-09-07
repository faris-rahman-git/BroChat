import { TypingType } from '../../../../app/dtos/socketTypes';
import { ISocketController } from '../../../../app/providers/controller/ISocketController';
import { IStartTypingUseCase } from '../../../../app/socketUseCase/typing/interfaces/IStartTypingUseCase';
import { CustomPayloadType } from '../../../../domain/entity/auth/authTypes';
import { ISocketRequest } from '../../socketHelper/ISocketRequest';

export class startTypingController implements ISocketController {
  constructor(private startTypingUseCase: IStartTypingUseCase) {}

  async handle(socketRequest: ISocketRequest): Promise<boolean> {
    try {
      const data = socketRequest.body as TypingType;

      const { id: userId } = socketRequest.user as CustomPayloadType;
      if (!userId) return false;

      const result = await this.startTypingUseCase.execute(data, userId);

      return result;
    } catch (error) {
      console.error('Error in startTypingController:', error);
      return false;
    }
  }
}
