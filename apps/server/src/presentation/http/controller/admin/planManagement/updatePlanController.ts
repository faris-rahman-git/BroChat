import { IController } from '../../../../../app/providers/controller/IController';
import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { IHttpErrors } from '../../../helpers/IHttpErrors';
import { HttpErrors } from '../../../helpers/implementations/HttpErrors';
import { IHttpRequest } from '../../../helpers/IHttpRequest';
import { IHttpResponse } from '../../../helpers/IHttpResponse';
import { HttpResponse } from '../../../helpers/implementations/HttpResponse';
import { IHttpSuccess } from '../../../helpers/IHttpSuccess';
import { HttpSuccess } from '../../../helpers/implementations/HttpSuccess';
import { PaymentType, PlanType } from '@bro/shared';
import { IUpdatePlanUseCase } from '../../../../../app/useCases/admin/planManagement/interfaces/IUpdatePlanUseCase';

export class updatePlanController implements IController {
  constructor(
    private updatePlanUseCase: IUpdatePlanUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    let error;
    let response: ResponseDTO;

    try {
      const { selectedChild } = httpRequest.path as {
        selectedChild: PaymentType;
      };
      const data = httpRequest.body as Omit<PlanType, 'createdAt'>;

      response = await this.updatePlanUseCase.execute(data, selectedChild);

      const success = this.httpSuccess.success_200(response.data);
      return new HttpResponse(success.statusCode, success.body);
    } catch (err) {
      console.error('Error in updatePlanController:', error);
      const errorResponse = this.httpErrors.error_500();
      return new HttpResponse(errorResponse.statusCode, errorResponse.body);
    }
  }
}
