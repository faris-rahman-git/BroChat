export type PlanType = {
  _id: string;
  duration?: number | null;
  createdAt: Date;
  isActive: boolean;
} & ExclusivePlanType;

export type ExclusivePlanType = {
  name: string;
  description: string;
  price: number;
  offerPrice: number;
};
