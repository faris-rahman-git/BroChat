import cron from 'node-cron';
import { jobAdapter } from '../../adapters/jobAdapter';
import { cleanExpiredSubscriptionsComposer } from '../../../infra/services/jobComposers/cleanExpiredSubscriptionsComposer';

const job = cleanExpiredSubscriptionsComposer();

let scheduled = false;

export function cleanExpiredSubscriptions() {
  if (scheduled) return;
  scheduled = true;

  cron.schedule('0 0 * * *', async () => {
    await jobAdapter(job);
  });
}
