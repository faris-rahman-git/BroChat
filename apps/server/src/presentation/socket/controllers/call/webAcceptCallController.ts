import { ISocketController } from '../../../../app/providers/controller/ISocketController';
import { IWebAcceptCallUseCase } from '../../../../app/socketUseCase/call/interfaces/IWebAcceptCallUseCase';
import { CustomPayloadType } from '../../../../domain/dtos/auth/authTypes';
import { ISocketRequest } from '../../socketHelper/ISocketRequest';

export class webAcceptCallController implements ISocketController {
  constructor(private webAcceptCallUseCase: IWebAcceptCallUseCase) {}

  async handle(socketRequest: ISocketRequest): Promise<boolean> {
    try {

      const { id: answerId } = socketRequest.user as CustomPayloadType;
      const { signal, to } = socketRequest.body as {
        signal: any;
        to: string;
      };

      const result = await this.webAcceptCallUseCase.execute(
        signal,
        to,
        answerId
      );
      return result;
    } catch (error) {
      console.error('Error in webAcceptCallController:', error);
      return false;
    }
  }
}
