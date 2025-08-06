import { IController } from '../../../../app/providers/controller/IController';
import { IUserReadRepo } from '../../../../app/repositories/user/IUserReadRepo';
import { UserReadRepo } from '../../../repositories/userRepo/UserReadRepo';
import { IEmailService } from '../../../../app/providers/auth/IEmailService';
import { IOtpService } from '../../../../app/providers/auth/IOtpService';
import { IOtpManagementRepo } from '../../../../app/repositories/redis/IOtpManagementRepo';
import { SendOtpUseCase } from '../../../../app/useCases/auth/implementations/SendOtpUseCase';
import { ISendOtpUseCase } from '../../../../app/useCases/auth/interfaces/ISendOtpUseCase';
import { NodemailerEmailService } from '../../../providers/auth/NodemailerEmailService';
import { OtpService } from '../../../providers/auth/OtpService';
import { OtpManagementRepo } from '../../../repositories/redisRepo/OtpManagementRepo';
import { ForgotPasswordUseCase } from '../../../../app/useCases/auth/implementations/ForgotPasswordUseCase';
import { forgotPasswordController } from '../../../../presentation/http/controller/auth/forgotPasswordController';
import { IForgotPasswordUseCase } from '../../../../app/useCases/auth/interfaces/IForgotPasswordUseCase';

export function forgotPasswordComposer(): IController {
  const userReadRepo: IUserReadRepo = new UserReadRepo();
  const emailService: IEmailService = new NodemailerEmailService();
  const otpRepository: IOtpManagementRepo = new OtpManagementRepo();
  const otpService: IOtpService = new OtpService(otpRepository);
  const sendOtpUseCase: ISendOtpUseCase = new SendOtpUseCase(
    otpService,
    emailService,
    otpRepository
  );
  const useCase: IForgotPasswordUseCase = new ForgotPasswordUseCase(
    userReadRepo,
    sendOtpUseCase
  );
  const controller: IController = new forgotPasswordController(useCase);
  return controller;
}
