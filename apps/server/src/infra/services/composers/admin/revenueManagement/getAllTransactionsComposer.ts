import { IController } from '../../../../../app/providers/controller/IController';
import { IQueryService } from '../../../../../app/providers/admin/IQueryService';
import { QueryService } from '../../../../providers/admin/QueryService';
import { GetAllTransactionsUseCase } from '../../../../../app/useCases/admin/revenueManagement/implementations/GetSubscriptionDetailsUseCase';
import { getAllTransactionsController } from '../../../../../presentation/http/controller/admin/revenueManagement/getAllTransactionsController';
import { IGetAllTransactionsUseCase } from '../../../../../app/useCases/admin/revenueManagement/interfaces/IGetAllTransactionsUseCase';
import { PaymentReadRepo } from '../../../../repositories/paymentRepo/PaymentReadRepo';
import { IPaymentReadRepo } from '../../../../../app/repositories/payment/IPaymentReadRepo';

export function getAllTransactionsComposer(): IController {
  const payReadRepo: IPaymentReadRepo = new PaymentReadRepo();
  const queryService: IQueryService = new QueryService();
  const useCase: IGetAllTransactionsUseCase = new GetAllTransactionsUseCase(
    payReadRepo,
    queryService
  );

  const controller: IController = new getAllTransactionsController(useCase);
  return controller;
}
