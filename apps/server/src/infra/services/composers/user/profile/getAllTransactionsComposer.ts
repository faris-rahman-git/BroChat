import { IController } from '../../../../../app/providers/controller/IController';
import { getAllTransactionsController } from '../../../../../presentation/http/controller/user/profile/getAllTransactionsController';
import { IGetAllTransactionsUseCase } from '../../../../../app/useCases/user/profile/interfaces/IGetAllTransactionsUseCase';
import { GetAllTransactionsUseCase } from '../../../../../app/useCases/user/profile/implementations/GetAllTransactionsUseCase';
import { PaymentReadRepo } from '../../../../repositories/paymentRepo/PaymentReadRepo';

export function getAllTransactionsComposer(): IController {
  const useCase: IGetAllTransactionsUseCase = new GetAllTransactionsUseCase(
    new PaymentReadRepo()
  );
  const controller: IController = new getAllTransactionsController(useCase);
  return controller;
}
