import { IController } from '../../../../app/providers/controller/IController';
import { loginController } from '../../../../presentation/http/controller/auth/loginController';
import { IUserReadRepo } from '../../../../app/repositories/user/IUserReadRepo';
import { UserReadRepo } from '../../../repositories/userRepo/UserReadRepo';
import { IPasswordService } from '../../../../app/providers/auth/IPasswordService';
import { PasswordService } from '../../../providers/auth/PasswordService';
import { ILoginUseCase } from '../../../../app/useCases/auth/interfaces/ILoginUseCase';
import { TokenService } from '../../../providers/auth/TokenService';
import { ITokenService } from '../../../../app/providers/auth/ITokenService';
import { LoginUseCase } from '../../../../app/useCases/auth/implementations/LoginUseCase';
import { IClearQueueService } from '../../../../app/providers/socket/IClearQueueService';
import { IOfflineQueueRepo } from '../../../../app/repositories/redis/IOfflineQueueRepo';
import { OfflineQueueRepo } from '../../../repositories/redisRepo/OfflineQueueRepo';
import { ClearQueueService } from '../../../providers/socket/ClearQueueService';

export function loginComposer(): IController {
  const userReadRepo: IUserReadRepo = new UserReadRepo();
  const passwordService: IPasswordService = new PasswordService();
  const tokenService: ITokenService = new TokenService();
  const offlineQueueRepo: IOfflineQueueRepo = new OfflineQueueRepo();
  const clearQueueService: IClearQueueService = new ClearQueueService(
    offlineQueueRepo
  );
  const useCase: ILoginUseCase = new LoginUseCase(
    userReadRepo,
    passwordService,
    tokenService,
    clearQueueService
  );
  const controller: IController = new loginController(useCase);
  return controller;
}
