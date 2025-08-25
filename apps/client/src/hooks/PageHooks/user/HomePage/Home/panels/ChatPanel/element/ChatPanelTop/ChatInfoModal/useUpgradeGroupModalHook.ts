import { useRazorpayPayment } from '@client/hooks/home/paymentHooks/useRazorpayPayment';
import { UserReduxType } from '@client/types/ReduxTypes';
import { useEffect, useState } from 'react';
import { PlanType } from '@bro/shared';
import { useGetPlansForm } from '@client/hooks/home/planHookes/logic/useGetPlansForm';
import { makeGroupPremium } from '@client/redux/features/userSlices/homeSlices/groupSlice/groupChatSlice';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';

export const useUpgradeGroupModalHook = (
  onOpenChange: (open: boolean) => void,
  conversationId: string,
  userDetails: UserReduxType,
  closeInfoModal: () => void,
  setShowThankYouModal: () => void
) => {
  const dispatch = useAppDispatch();
  const { startPayment } = useRazorpayPayment();
  const [groupPlan, setGroupPlan] = useState<PlanType[]>([]);

  const { getPlanMutate } = useGetPlansForm(setGroupPlan);

  useEffect(() => {
    getPlanMutate('paid_group');
  }, []);

  const handleUpgradeGroup = async () => {
    onOpenChange(false);
    closeInfoModal();
    const subscriptionSuccess = await startPayment({
      amount: groupPlan[0]?.offerPrice ?? 99,
      feature: 'paid_group',
      recipientName: userDetails.name ?? 'bro chat user',
      recipientEmail: userDetails.email ?? 'user@brochat.com',
      conversationId,
    });

    if (subscriptionSuccess) {
      dispatch(makeGroupPremium({ conversationId }));
      setShowThankYouModal();
    }
  };

  return {
    groupPlan: groupPlan[0],
    handleUpgradeGroup,
  };
};
