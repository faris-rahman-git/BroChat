import { IController } from '../../../../app/providers/controller/IController';
import { ITokenService } from '../../../../app/providers/auth/ITokenService';
import { TokenService } from '../../../providers/auth/TokenService';
import { IUserReadRepo } from '../../../../app/repositories/user/IUserReadRepo';
import { UserReadRepo } from '../../../repositories/userRepo/UserReadRepo';
import { IUsernameService } from '../../../../app/providers/auth/IUsernameService';
import { IUserWriteRepo } from '../../../../app/repositories/user/IUserWriteRepo';
import { UsernameService } from '../../../providers/auth/UsernameService';
import { UserWriteRepo } from '../../../repositories/userRepo/UserWriteRepo';
import { SocialRegisterOrLoginUseCase } from '../../../../app/useCases/auth/implementations/SocialRegisterOrLoginUseCase';
import { socialRegisterOrLoginController } from '../../../../presentation/http/controller/auth/socialRegisterOrLoginController';
import { ISocialRegisterOrLoginUseCase } from '../../../../app/useCases/auth/interfaces/ISocialRegisterOrLoginUseCase';
import { IClearQueueService } from '../../../../app/providers/socket/IClearQueueService';
import { IOfflineQueueRepo } from '../../../../app/repositories/redis/IOfflineQueueRepo';
import { ClearQueueService } from '../../../providers/socket/ClearQueueService';
import { OfflineQueueRepo } from '../../../repositories/redisRepo/OfflineQueueRepo';

export function socialRegisterOrLoginComposer(): IController {
  const userReadRepo: IUserReadRepo = new UserReadRepo();
  const tokenService: ITokenService = new TokenService();
  const usernameService: IUsernameService = new UsernameService(userReadRepo);
  const userWriteRepo: IUserWriteRepo = new UserWriteRepo();
  const offlineQueueRepo: IOfflineQueueRepo = new OfflineQueueRepo();
  const clearQueueService: IClearQueueService = new ClearQueueService(
    offlineQueueRepo
  );
  const useCase: ISocialRegisterOrLoginUseCase =
    new SocialRegisterOrLoginUseCase(
      userReadRepo,
      tokenService,
      usernameService,
      userWriteRepo,
      clearQueueService
    );

  const controller: IController = new socialRegisterOrLoginController(useCase);
  return controller;
}
