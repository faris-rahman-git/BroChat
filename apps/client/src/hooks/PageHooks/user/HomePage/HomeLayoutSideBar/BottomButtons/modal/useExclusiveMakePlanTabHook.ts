import { useEffect, useState } from 'react';
import { ExclusivePlanType, PlanType } from '@bro/shared';
import { useGetPlansForm } from '@client/hooks/home/planHookes/logic/useGetPlansForm';
import { useCreatePlanForm } from '@client/hooks/home/planHookes/logic/useCreatePlanForm';
import { useRazorpayPayment } from '@client/hooks/home/paymentHooks/useRazorpayPayment';
import { UserReduxType } from '@client/types/ReduxTypes';

export const useExclusiveMakePlanTabHook = (
  setExclusivePlanKid: (plan: PlanType | null) => void,
  setShowThankYouModal: () => void,
  onClose: () => void,
  userDetails: UserReduxType
) => {
  const [customPlan, setCustomPlan] = useState({
    planName: 'Private Chat Access',
    description:
      'Get direct one-on-one chat access with me. Ask questions, share ideas, or have a friendly conversation anytime during your active plan',
    price: '159',
    offerPrice: '99',
  });
  const [exclusivePlan, setExclusivePlan] = useState<PlanType | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const { getPlanMutate } = useGetPlansForm(setExclusivePlan);

  useEffect(() => {
    getPlanMutate('exclusive_user');
  }, []);

  const { createPlanMutate } = useCreatePlanForm(
    setExclusivePlanKid,
    setShowThankYouModal,
    onClose
  );

  const { startPayment } = useRazorpayPayment();

  const handlePaymentAndSavePlan = async (amount: number) => {
    const { planName, description, price, offerPrice } = customPlan;

    if (
      planName === '' ||
      description === '' ||
      price === '' ||
      offerPrice === ''
    ) {
      setErrorMessage('All fields are required');
      return;
    }

    const subscriptionSuccess = await startPayment({
      amount,
      feature: 'exclusive_user',
      recipientName: userDetails.name ?? 'bro chat user',
      recipientEmail: userDetails.email ?? 'user@brochat.com',
      userId: userDetails.id!,
    });

    if (subscriptionSuccess) {
      const payload: ExclusivePlanType = {
        name: planName,
        description,
        price: Number(price),
        offerPrice: Number(offerPrice),
      };
      createPlanMutate(payload);
    }
  };

  return {
    handlePaymentAndSavePlan ,
    setCustomPlan,
    exclusivePlan,
    errorMessage,
    customPlan,
  }
};
