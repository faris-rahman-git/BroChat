import { IController } from '../../../../../app/providers/controller/IController';
import { createOrderController } from '../../../../../presentation/http/controller/user/payment/createOrderController';
import { ICreateOrderUseCase } from '../../../../../app/useCases/user/payment/interfaces/ICreateOrderUseCase';
import { CreateOrderUseCase } from '../../../../../app/useCases/user/payment/implementations/CreateOrderUseCase';
import { PaymentService } from '../../../../providers/user/PaymentService';
import { IPaymentService } from '../../../../../app/providers/user/IPaymentService';

export function createOrderComposer(): IController {
  const paymentService: IPaymentService = new PaymentService();
  const useCase: ICreateOrderUseCase = new CreateOrderUseCase(paymentService);

  const controller: IController = new createOrderController(useCase);
  return controller;
}
