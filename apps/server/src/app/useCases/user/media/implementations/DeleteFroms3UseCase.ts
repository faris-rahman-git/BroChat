import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
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
    } catch (err: any) {
      console.log('Error in DeleteFroms3UseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
