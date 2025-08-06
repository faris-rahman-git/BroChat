import { IController } from '../../../../app/providers/controller/IController';
import { RefreshUseCase } from '../../../../app/useCases/auth/implementations/RefreshUseCase';
import { refreshController } from '../../../../presentation/http/controller/auth/refreshController';
import { ITokenService } from '../../../../app/providers/auth/ITokenService';
import { TokenService } from '../../../providers/auth/TokenService';
import { IRefreshUseCase } from '../../../../app/useCases/auth/interfaces/IRefreshUseCase';

export function refreshComposer(): IController {
  const tokenService: ITokenService = new TokenService();
  const useCase: IRefreshUseCase = new RefreshUseCase(tokenService);

  const controller: IController = new refreshController(useCase);
  return controller;
}
