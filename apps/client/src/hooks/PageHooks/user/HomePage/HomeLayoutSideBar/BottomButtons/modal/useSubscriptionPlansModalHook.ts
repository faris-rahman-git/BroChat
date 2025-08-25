import { RootState } from '@client/redux/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PlanType } from '@bro/shared';
import { useGetPlansForm } from '@client/hooks/home/planHookes/logic/useGetPlansForm';
import { useRazorpayPayment } from '@client/hooks/home/paymentHooks/useRazorpayPayment';

export const useSubscriptionPlansModalHook = (
  open: boolean,
  onClose: () => void,
  setShowThankYouModal: () => void
) => {
  const userDetails = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  const [subscriptionPlan, setSubscriptionPlan] = useState<PlanType[]>([]);

  const { getPlanMutate } = useGetPlansForm(setSubscriptionPlan);


  useEffect(() => {
    getPlanMutate('subscription');
  }, []);
  
  const { startPayment } = useRazorpayPayment();

  const handleSubscribe = async (
    amount: number,
    duration: number,
    planName: string
  ) => {
    onClose();
    const subscriptionSuccess = await startPayment({
      amount,
      feature: 'subscription',
      recipientName: userDetails.name ?? 'bro chat user',
      recipientEmail: userDetails.email ?? 'user@brochat.com',
      userId: userDetails.id!,
      duration,
      planName,
    });

    if (subscriptionSuccess) {
      setShowThankYouModal();
    }
  };

  return { subscriptionPlan, handleSubscribe };
};
