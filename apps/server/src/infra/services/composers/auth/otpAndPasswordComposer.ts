import { IController } from '../../../../app/providers/controller/IController';
import { IUserReadRepo } from '../../../../app/repositories/user/IUserReadRepo';
import { UserReadRepo } from '../../../repositories/userRepo/UserReadRepo';
import { OtpAndPasswordUseCase } from '../../../../app/useCases/auth/implementations/OtpAndPasswordUseCase';
import { IOtpAndPasswordUseCase } from '../../../../app/useCases/auth/interfaces/IOtpAndPasswordUseCase';
import { IOtpManagementRepo } from '../../../../app/repositories/redis/IOtpManagementRepo';
import { OtpManagementRepo } from '../../../repositories/redisRepo/OtpManagementRepo';
import { IOtpService } from '../../../../app/providers/auth/IOtpService';
import { OtpService } from '../../../providers/auth/OtpService';
import { IPasswordService } from '../../../../app/providers/auth/IPasswordService';
import { PasswordService } from '../../../providers/auth/PasswordService';
import { IUsernameService } from '../../../../app/providers/auth/IUsernameService';
import { IUserWriteRepo } from '../../../../app/repositories/user/IUserWriteRepo';
import { UserWriteRepo } from '../../../repositories/userRepo/UserWriteRepo';
import { otpAndPasswordController } from '../../../../presentation/http/controller/auth/otpAndPasswordController';
import { UsernameService } from '../../../providers/auth/UsernameService';

export function otpAndPasswordComposer(): IController {
  const userReadRepo: IUserReadRepo = new UserReadRepo();
  const otpRepository: IOtpManagementRepo = new OtpManagementRepo();
  const otpService: IOtpService = new OtpService(otpRepository);
  const passwordService: IPasswordService = new PasswordService();
  const usernameService: IUsernameService = new UsernameService(userReadRepo);
  const userWriteRepo: IUserWriteRepo = new UserWriteRepo();
  const useCase: IOtpAndPasswordUseCase = new OtpAndPasswordUseCase(
    userReadRepo,
    otpService,
    passwordService,
    usernameService,
    userWriteRepo
  );

  const controller: IController = new otpAndPasswordController(useCase);
  return controller;
}
