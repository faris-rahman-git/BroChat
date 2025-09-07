import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IS3UrlUseCase {
  execute(fileType: string, extension: string): Promise<ResponseDTO>;
}
