import { IController } from '../../../../../app/providers/controller/IController';
import { MediaService } from '../../../../providers/user/MediaService';
import { IMediaService } from '../../../../../app/providers/user/IMediaService';
import { S3UrlUseCase } from '../../../../../app/useCases/user/media/implementations/S3UrlUseCase';
import { IS3UrlUseCase } from '../../../../../app/useCases/user/media/interfaces/IS3UrlUseCase';
import { s3UrlController } from '../../../../../presentation/http/controller/user/media/s3UrlController';

export function s3UrlComposer(): IController {
  const mediaService: IMediaService = new MediaService();
  const useCase: IS3UrlUseCase = new S3UrlUseCase(mediaService);

  const controller: IController = new s3UrlController(useCase);
  return controller;
}
