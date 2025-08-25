import { ExclusivePlanType, PlanType } from '@bro/shared';
import planModel from '../../databases/mongo/db/planModel';
import { IPlanWriteRepo } from '../../../app/repositories/plan/IPlanWriteRepo';

export class PlanWriteRepo implements IPlanWriteRepo {
  async saveNewSubscriptionPlan(
    data: Omit<PlanType, '_id' | 'createdAt'>
  ): Promise<void> {
    await planModel.create({
      ...data,
      PlanType: 'subscription',
      createdAt: new Date(),
    });
  }

  async updatePlan(data: Omit<PlanType, 'createdAt'>): Promise<void> {
    await planModel.updateOne({ _id: data._id }, { $set: data });
  }

  async createNewExclusiveUserCustomerPlan(
    data: ExclusivePlanType,
    userId: string
  ): Promise<void> {
    await planModel.create({
      ...data,
      isActive: true,
      PlanType: 'exclusive_user_customer',
      exclusiveUserId: userId,
    });
  }

  async updateExclusiveCustomerPlan(
    data: ExclusivePlanType & { _id: string }
  ): Promise<void> {
    await planModel.updateOne(
      { _id: data._id },
      {
        $set: {
          name: data.name,
          description: data.description,
          price: data.price,
          offerPrice: data.offerPrice,
        },
      }
    );
  }
}
