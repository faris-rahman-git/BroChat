import { IController } from '../../../../app/providers/controller/IController';
import { ISendOtpUseCase } from '../../../../app/useCases/auth/interfaces/ISendOtpUseCase';
import { SendOtpUseCase } from '../../../../app/useCases/auth/implementations/SendOtpUseCase';
import { IEmailService } from '../../../../app/providers/auth/IEmailService';
import { NodemailerEmailService } from '../../../providers/auth/NodemailerEmailService';
import { IOtpManagementRepo } from '../../../../app/repositories/redis/IOtpManagementRepo';
import { OtpManagementRepo } from '../../../repositories/redisRepo/OtpManagementRepo';
import { IOtpService } from '../../../../app/providers/auth/IOtpService';
import { OtpService } from '../../../providers/auth/OtpService';
import { resendOtpController } from '../../../../presentation/http/controller/auth/resendOtpController';

export function resendOtpComposer(): IController {
  const emailService: IEmailService = new NodemailerEmailService();
  const otpRepository: IOtpManagementRepo = new OtpManagementRepo();
  const otpService: IOtpService = new OtpService(otpRepository);
  const useCase: ISendOtpUseCase = new SendOtpUseCase(
    otpService,
    emailService,
    otpRepository
  );
  const controller: IController = new resendOtpController(useCase);
  return controller;
}
