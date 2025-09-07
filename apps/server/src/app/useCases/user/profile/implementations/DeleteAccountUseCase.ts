import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
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
    } catch (err) {
      console.log('Error in DeleteAccountUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
