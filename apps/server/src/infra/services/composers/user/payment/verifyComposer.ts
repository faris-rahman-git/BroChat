import { IController } from '../../../../../app/providers/controller/IController';
import { PaymentService } from '../../../../providers/user/PaymentService';
import { IPaymentService } from '../../../../../app/providers/user/IPaymentService';
import { verifyController } from '../../../../../presentation/http/controller/user/payment/verifyController';
import { IVerifyUseCase } from '../../../../../app/useCases/user/payment/interfaces/IVerifyUseCase';
import { VerifyUseCase } from '../../../../../app/useCases/user/payment/implementations/VerifyUseCase';
import { PremiumUpdateService } from '../../../../providers/user/PremiumUpdateService';
import { IPremiumUpdateService } from '../../../../../app/providers/user/IPremiumUpdateService';
import { ConversationWriteRepo } from '../../../../repositories/conversationRepo/ConversationWriteRepo';
import { ReceiverService } from '../../../../providers/common/ReceiverService';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { IEventQueueService } from '../../../../../app/providers/socket/IEventQueueService';
import { EventQueueService } from '../../../../providers/socket/EventQueueService';
import { OfflineQueueRepo } from '../../../../repositories/redisRepo/OfflineQueueRepo';
import { TypingQueueRepo } from '../../../../repositories/redisRepo/TypingQueueRepo';
import { UserManagementRepo } from '../../../../repositories/redisRepo/UserManagementRepo';
import { UserReadRepo } from '../../../../repositories/userRepo/UserReadRepo';
import { IPaymentWriteRepo } from '../../../../../app/repositories/payment/IPaymentWriteRepo';
import { PaymentWriteRepo } from '../../../../repositories/paymentRepo/PaymentWriteRepo';
import { UserWriteRepo } from '../../../../repositories/userRepo/UserWriteRepo';

export function verifyComposer(): IController {
  const paymentService: IPaymentService = new PaymentService();
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const paymentWriteRepo: IPaymentWriteRepo = new PaymentWriteRepo();
  const eventQueueService: IEventQueueService = new EventQueueService(
    new OfflineQueueRepo(),
    new TypingQueueRepo(),
    new UserManagementRepo(),
    conReadRepo,
    new UserReadRepo()
  );
  const premiumUpdateService: IPremiumUpdateService = new PremiumUpdateService(
    new ConversationWriteRepo(),
    new ReceiverService(conReadRepo),
    eventQueueService,
    new UserWriteRepo(),
    conReadRepo,
    paymentWriteRepo
  );
  const useCase: IVerifyUseCase = new VerifyUseCase(
    paymentService,
    premiumUpdateService,
    paymentWriteRepo
  );

  const controller: IController = new verifyController(useCase);
  return controller;
}
