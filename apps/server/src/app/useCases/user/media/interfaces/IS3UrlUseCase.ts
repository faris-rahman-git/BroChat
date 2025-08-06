import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IS3UrlUseCase {
  execute(fileType: string, extension: string): Promise<ResponseDTO>;
}
