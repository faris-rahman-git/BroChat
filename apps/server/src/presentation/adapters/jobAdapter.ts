import { IJobController } from '../../app/providers/controller/IJobController';

export async function jobAdapter(apiRoute: IJobController): Promise<void> {
  await apiRoute.handle();
}
