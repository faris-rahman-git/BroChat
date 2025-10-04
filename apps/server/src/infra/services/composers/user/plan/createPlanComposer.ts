import { IController } from '../../../../../app/providers/controller/IController';
import { createPlanController } from '../../../../../presentation/http/controller/user/plan/createPlanController';
import { ICreatePlanUseCase } from '../../../../../app/useCases/user/plan/interfaces/ICreatePlanUseCase';
import { CreatePlanUseCase } from '../../../../../app/useCases/user/plan/implementations/CreatePlanUseCase';
import { PlanWriteRepo } from '../../../../repositories/planRepo/PlanWriteRepo';
import { PlanReadRepo } from '../../../../repositories/planRepo/PlanReadRepo';
import { ICheckAuthorityService } from '../../../../../app/providers/user/ICheckAuthorityService';
import { CheckAuthorityService } from '../../../../providers/user/CheckAuthorityService';
import { PaymentReadRepo } from '../../../../repositories/paymentRepo/PaymentReadRepo';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';

export function createPlanComposer(): IController {
  const checkAuthService: ICheckAuthorityService = new CheckAuthorityService(
    new ConversationReadRepo(),
    new PaymentReadRepo()
  );
  const useCase: ICreatePlanUseCase = new CreatePlanUseCase(
    new PlanWriteRepo(),
    new PlanReadRepo(),
    checkAuthService
  );

  const controller: IController = new createPlanController(useCase);
  return controller;
}
