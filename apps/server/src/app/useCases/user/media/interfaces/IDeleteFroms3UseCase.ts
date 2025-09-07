import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IDeleteFroms3UseCase {
  execute(imageUrl: string): Promise<ResponseDTO>;
}
