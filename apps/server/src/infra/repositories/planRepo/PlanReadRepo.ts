import { IPlanReadRepo } from '../../../app/repositories/plan/IPlanReadRepo';
import { PaymentType, PlanType } from '@bro/shared';
import planModel from '../../databases/mongo/db/planModel';

export class PlanReadRepo implements IPlanReadRepo {
  async findPlans(
    selectedChild: PaymentType,
    isUserListSubscription = false
  ): Promise<PlanType[]> {
    let query;
    if (isUserListSubscription) {
      query = { PlanType: selectedChild, isActive: true };
    } else {
      query = { PlanType: selectedChild };
    }

    const result = await planModel.find(query).sort({ createdAt: -1 }).lean();

    return result.map((p) => ({
      _id: String(p._id),
      name: p.name,
      description: p.description,
      price: p.price,
      offerPrice: p.offerPrice,
      duration: p.duration,
      isActive: p.isActive,
      createdAt: p.createdAt,
    }));
  }

  async findExclusiveUserCustomer(userId: string): Promise<PlanType | null> {
    const result = await planModel
      .findOne({ PlanType: 'exclusive_user_customer', exclusiveUserId: userId })
      .lean();

    if (!result) return null;

    return {
      _id: String(result._id),
      name: result.name,
      description: result.description,
      price: result.price,
      offerPrice: result.offerPrice,
      duration: result.duration,
      isActive: result.isActive,
      createdAt: result.createdAt,
    };
  }
}
