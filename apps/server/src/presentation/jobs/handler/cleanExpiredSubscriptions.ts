import cron from 'node-cron';
import { jobAdapter } from '../../adapters/jobAdapter';
import { cleanExpiredSubscriptionsComposer } from '../../../infra/services/jobComposers/cleanExpiredSubscriptionsComposer';

export function cleanExpiredSubscriptions() {
  cron.schedule('0 0 * * *', async () => {
    await jobAdapter(cleanExpiredSubscriptionsComposer());
  });
}
