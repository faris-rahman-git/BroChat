import { IController } from '../../../../../app/providers/controller/IController';
import { getDashboardController } from '../../../../../presentation/http/controller/admin/dashboard/getDashboardController';
import { IGetDashboardUseCase } from '../../../../../app/useCases/admin/dashboard/interfaces/IGetDashboardUseCase';
import { GetDashboardUseCase } from '../../../../../app/useCases/admin/dashboard/implementations/GetDashboardUseCase';
import { UserReadRepo } from '../../../../repositories/userRepo/UserReadRepo';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { PaymentReadRepo } from '../../../../repositories/paymentRepo/PaymentReadRepo';
import { MessageReadRepo } from '../../../../repositories/messageRepo/MessageReadRepo';

export function getDashboardComposer(): IController {
  const useCase: IGetDashboardUseCase = new GetDashboardUseCase(
    new UserReadRepo(),
    new ConversationReadRepo(),
    new PaymentReadRepo(),
    new MessageReadRepo()
  );

  const controller: IController = new getDashboardController(useCase);
  return controller;
}
