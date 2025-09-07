import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { IMediaService } from '../../../../providers/user/IMediaService';
import { IDeleteFroms3UseCase } from '../interfaces/IDeleteFroms3UseCase';

export class DeleteFroms3UseCase implements IDeleteFroms3UseCase {
  constructor(private mediaService: IMediaService) {}

  async execute(imageUrl: string): Promise<ResponseDTO> {
    try {
      await this.mediaService.mediaRemove(imageUrl);

      return {
        success: true,
      };
    } catch (err) {
      console.log('Error in DeleteFroms3UseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
