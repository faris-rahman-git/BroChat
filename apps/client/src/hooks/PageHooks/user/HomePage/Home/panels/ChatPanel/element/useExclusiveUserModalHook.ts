import { useRazorpayPayment } from '@client/hooks/home/paymentHooks/useRazorpayPayment';
import { useEffect, useState } from 'react';
import { PlanType } from '@bro/shared';
import { usegetExclusiveCustomPlanForm } from '@client/hooks/home/planHookes/logic/usegetExclusiveCustomPlanForm';
import { useCreateNewConversation } from '@client/hooks/home/dmHooks/api/useCreateNewConversation';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { setActiveReceiverConversationId } from '@client/redux/features/userSlices/homeSlices/commonSlices/activeReceiverSlice';
import { UserReduxType } from '@client/types/ReduxTypes';

export const useExclusiveUserModalHook = (
  onOpenChange: (open: boolean) => void,
  userDetails: UserReduxType,
  receiverId: string
) => {
  const { startPayment } = useRazorpayPayment();
  const [exclusivePlan, setExclusivePlan] = useState<PlanType | null>(null);
  const dispatch = useAppDispatch();

  const { getExclusiveCustomPlanMutate } =
    usegetExclusiveCustomPlanForm(setExclusivePlan);
  const { mutate: createNewConversationMutate } = useCreateNewConversation();

  useEffect(() => {
    getExclusiveCustomPlanMutate(receiverId);
  }, []);

  const handleUpgradeUser = async () => {
    onOpenChange(false);

    const subscriptionSuccess = await startPayment({
      amount: exclusivePlan?.offerPrice ?? 199,
      feature: 'exclusive_user_customer',
      recipientName: userDetails.name ?? 'Bro Chat User',
      recipientEmail: userDetails.email ?? 'user@brochat.com',
      userId: userDetails.id as string,
      exclusiveUserId: receiverId,
    });

    if (subscriptionSuccess) {
      createNewConversationMutate(receiverId, {
        onSuccess: (data) => {
          const conversationId = data.newConversationId;
          dispatch(setActiveReceiverConversationId(conversationId));
        },
      });
    }
  };

  return {handleUpgradeUser, exclusivePlan};
};
