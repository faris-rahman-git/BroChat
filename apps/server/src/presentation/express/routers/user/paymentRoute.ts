import { Router } from 'express';
import { expressAdapter } from '../../../adapters/expressAdapter';
import { authExpress } from '../../middlewares/authExpress';
import { createOrderComposer } from '../../../../infra/services/composers/user/payment/createOrderComposer';
import { verifyComposer } from '../../../../infra/services/composers/user/payment/verifyComposer';

const paymentRoute = Router();

paymentRoute.post('/createorder', authExpress, async (request, response) => {
  await expressAdapter(request, response, createOrderComposer());
});

paymentRoute.post('/verify', authExpress, async (request, response) => {
  await expressAdapter(request, response, verifyComposer());
});

export default paymentRoute;
