import { useEffect, useState } from 'react';
import {
  planSchema,
  PlanSchemaType,
  PlanType,
} from '@bro/shared';
import { useGetPlansForm } from '@client/hooks/home/planHookes/logic/useGetPlansForm';
import { useCreatePlanForm } from '@client/hooks/home/planHookes/logic/useCreatePlanForm';
import { useRazorpayPayment } from '@client/hooks/home/paymentHooks/useRazorpayPayment';
import { UserReduxType } from '@client/types/ReduxTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const useExclusiveMakePlanTabHook = (
  setExclusivePlanKid: (plan: PlanType | null) => void,
  setShowThankYouModal: () => void,
  onClose: () => void,
  userDetails: UserReduxType
) => {
  const [exclusivePlan, setExclusivePlan] = useState<PlanType[]>([]);

  const { getPlanMutate } = useGetPlansForm(setExclusivePlan);

  useEffect(() => {
    getPlanMutate('exclusive_user');
  }, []);

  const { createPlanMutate, createPlanError } = useCreatePlanForm(
    setExclusivePlanKid,
    setShowThankYouModal,
    onClose
  );

  const { startPayment } = useRazorpayPayment();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlanSchemaType>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      planName: 'Private Chat Access',
      description:
        'Get direct one-on-one chat access with me. Ask questions, share ideas, or have a friendly conversation anytime during your active plan',
      price: '159',
      offerPrice: '99',
    },
  });

  const handlePaymentAndSavePlan = async (
    data: PlanSchemaType,
    amount: number
  ) => {
    const subscriptionSuccess = await startPayment({
      amount,
      feature: 'exclusive_user',
      recipientName: userDetails.name ?? 'bro chat user',
      recipientEmail: userDetails.email ?? 'user@brochat.com',
      userId: userDetails.id!,
    });

    if (subscriptionSuccess) {
      const payload: PlanSchemaType = {
        planName: data.planName,
        description: data.description,
        price: data.price,
        offerPrice: data.offerPrice,
      };
      createPlanMutate(payload);
    }
  };

  return {
    handlePaymentAndSavePlan,
    exclusivePlan: exclusivePlan[0],
    register,
    errors,
    handleSubmit,
    createPlanError,
  };
};
