import { IController } from '../../../../../app/providers/controller/IController';
import { MediaService } from '../../../../providers/user/MediaService';
import { IMediaService } from '../../../../../app/providers/user/IMediaService';
import { DeleteFroms3UseCase } from '../../../../../app/useCases/user/media/implementations/DeleteFroms3UseCase';
import { IDeleteFroms3UseCase } from '../../../../../app/useCases/user/media/interfaces/IDeleteFroms3UseCase';
import { deleteFroms3Controller } from '../../../../../presentation/http/controller/user/media/deleteFroms3Controller';

export function deleteFroms3Composer(): IController {
  const mediaService: IMediaService = new MediaService();
  const useCase: IDeleteFroms3UseCase = new DeleteFroms3UseCase(mediaService);

  const controller: IController = new deleteFroms3Controller(useCase);
  return controller;
}
