import { IController } from '../../../../app/providers/controller/IController';
import { IOtpManagementRepo } from '../../../../app/repositories/redis/IOtpManagementRepo';
import { OtpManagementRepo } from '../../../repositories/redisRepo/OtpManagementRepo';
import { IOtpService } from '../../../../app/providers/auth/IOtpService';
import { OtpService } from '../../../providers/auth/OtpService';
import { IPasswordService } from '../../../../app/providers/auth/IPasswordService';
import { PasswordService } from '../../../providers/auth/PasswordService';
import { IUserWriteRepo } from '../../../../app/repositories/user/IUserWriteRepo';
import { UserWriteRepo } from '../../../repositories/userRepo/UserWriteRepo';
import { ResetPasswordUseCase } from '../../../../app/useCases/auth/implementations/ResetPasswordUseCase';
import { IResetPasswordUseCase } from '../../../../app/useCases/auth/interfaces/IResetPasswordUseCase';
import { resetPasswordController } from '../../../../presentation/http/controller/auth/resetPasswordController';

export function resetPasswordComposer(): IController {
  const otpRepository: IOtpManagementRepo = new OtpManagementRepo();
  const otpService: IOtpService = new OtpService(otpRepository);
  const passwordService: IPasswordService = new PasswordService();
  const userWriteRepo: IUserWriteRepo = new UserWriteRepo();
  const useCase: IResetPasswordUseCase = new ResetPasswordUseCase(
    otpService,
    passwordService,
    userWriteRepo
  );

  const controller: IController = new resetPasswordController(useCase);
  return controller;
}
