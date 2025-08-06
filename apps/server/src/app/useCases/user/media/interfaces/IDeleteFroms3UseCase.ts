import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IDeleteFroms3UseCase {
  execute(imageUrl: string): Promise<ResponseDTO>;
}
