import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { IUserWriteRepo } from '../../../../repositories/user/IUserWriteRepo';
import { IDeleteAccountUseCase } from '../interfaces/IDeleteAccountUseCase';

export class DeleteAccountUseCase implements IDeleteAccountUseCase {
  constructor(private userWriteRepo: IUserWriteRepo) {}

  async execute(userId: string): Promise<ResponseDTO> {
    try {
      await this.userWriteRepo.updateSoftDeleteStatus(userId, true, 'user');

      return {
        success: true,
      };
    } catch (err: any) {
      console.log('Error in DeleteAccountUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
