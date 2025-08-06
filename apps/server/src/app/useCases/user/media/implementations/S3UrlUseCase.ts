import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { IMediaService } from '../../../../providers/user/IMediaService';
import { IS3UrlUseCase } from '../interfaces/IS3UrlUseCase';

export class S3UrlUseCase implements IS3UrlUseCase {
  constructor(private mediaService: IMediaService) {}

  async execute(fileType: string, extension: string): Promise<ResponseDTO> {
    try {
      const uploadUrl = await this.mediaService.mediaUpload(
        fileType,
        extension
      );

      return {
        success: true,
        data: { uploadUrl },
      };
    } catch (err: any) {
      console.log('Error in S3UrlUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
