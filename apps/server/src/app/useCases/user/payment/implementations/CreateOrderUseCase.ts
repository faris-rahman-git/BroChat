import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { IPaymentService } from '../../../../providers/user/IPaymentService';
import { ICreateOrderUseCase } from '../interfaces/ICreateOrderUseCase';

export class CreateOrderUseCase implements ICreateOrderUseCase {
  constructor(private paymentService: IPaymentService) {}

  async execute(amount: number): Promise<ResponseDTO> {
    try {
      const order = await this.paymentService.createOrder(amount);

      return {
        success: true,
        data: { order },
      };
    } catch (err) {
      console.log('Error in CreateOrderUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
