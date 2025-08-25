import { IController } from '../../../../../app/providers/controller/IController';
import { PaymentReadRepo } from '../../../../repositories/paymentRepo/PaymentReadRepo';
import { IPaymentReadRepo } from '../../../../../app/repositories/payment/IPaymentReadRepo';
import { getExclusiveUserPaymentsController } from '../../../../../presentation/http/controller/admin/revenueManagement/getExclusiveUserPaymentsController';
import { IGetExclusiveUserPaymentsUseCase } from '../../../../../app/useCases/admin/revenueManagement/interfaces/IGetExclusiveUserPaymentsUseCase';
import { GetExclusiveUserPaymentsUseCase } from '../../../../../app/useCases/admin/revenueManagement/implementations/GetExclusiveUserPaymentsUseCase';

export function getExclusiveUserPaymentsComposer(): IController {
  const payReadRepo: IPaymentReadRepo = new PaymentReadRepo();
  const useCase: IGetExclusiveUserPaymentsUseCase =
    new GetExclusiveUserPaymentsUseCase(payReadRepo);

  const controller: IController = new getExclusiveUserPaymentsController(
    useCase
  );
  return controller;
}
