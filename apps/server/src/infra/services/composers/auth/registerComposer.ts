import { IController } from '../../../../app/providers/controller/IController';
import { IUserReadRepo } from '../../../../app/repositories/user/IUserReadRepo';
import { UserReadRepo } from '../../../repositories/userRepo/UserReadRepo';

import { RegisterUserUseCase } from '../../../../app/useCases/auth/implementations/RegisterUserUseCase';
import { IRegisterUserUseCase } from '../../../../app/useCases/auth/interfaces/IRegisterUserUseCase';
import { ISendOtpUseCase } from '../../../../app/useCases/auth/interfaces/ISendOtpUseCase';
import { SendOtpUseCase } from '../../../../app/useCases/auth/implementations/SendOtpUseCase';
import { IEmailService } from '../../../../app/providers/auth/IEmailService';
import { NodemailerEmailService } from '../../../providers/auth/NodemailerEmailService';
import { IOtpManagementRepo } from '../../../../app/repositories/redis/IOtpManagementRepo';
import { OtpManagementRepo } from '../../../repositories/redisRepo/OtpManagementRepo';
import { registerController } from '../../../../presentation/http/controller/auth/registerController';
import { IOtpService } from '../../../../app/providers/auth/IOtpService';
import { OtpService } from '../../../providers/auth/OtpService';

export function registerComposer(): IController {
  const userRepo: IUserReadRepo = new UserReadRepo();
  const emailService: IEmailService = new NodemailerEmailService();
  const otpRepository: IOtpManagementRepo = new OtpManagementRepo();
  const otpService: IOtpService = new OtpService(otpRepository);
  const sendOtpUseCase: ISendOtpUseCase = new SendOtpUseCase(
    otpService,
    emailService,
    otpRepository
  );
  const useCase: IRegisterUserUseCase = new RegisterUserUseCase(
    userRepo,
    sendOtpUseCase
  );
  const controller: IController = new registerController(useCase);
  return controller;
}
