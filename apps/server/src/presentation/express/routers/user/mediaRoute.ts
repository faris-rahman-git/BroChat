import { Router } from 'express';
import { expressAdapter } from '../../../adapters/expressAdapter';
import { authExpress } from '../../middlewares/authExpress';
import { s3UrlComposer } from '../../../../infra/services/composers/user/media/s3UrlComposer';
import { deleteFroms3Composer } from '../../../../infra/services/composers/user/media/deleteFroms3Composer';

const mediaRoute = Router();

mediaRoute.post('/s3url', authExpress, async (request, response) => {
  console.log('check s3url 1:');
  await expressAdapter(request, response, s3UrlComposer());
});

mediaRoute.delete('/deletefroms3', authExpress, async (request, response) => {
  await expressAdapter(request, response, deleteFroms3Composer());
});

export default mediaRoute;
