import { Button } from '@client/components/ui/button';
import CustomModals from '@client/components/customUi/commonElemets/CustomModals';
import { useRazorpayPayment } from '@client/hooks/home/paymentHooks/useRazorpayPayment';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { makeGroupPremium } from '@client/redux/features/userSlices/homeSlices/groupSlice/groupChatSlice';
import { UserReduxType } from '@client/types/ReduxTypes';

type UpgradeGroupModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
  userDetails: UserReduxType;
  closeInfoModal: () => void;
  setShowThankYouModal: () => void;
};

const UpgradeGroupModal = ({
  open,
  onOpenChange,
  conversationId,
  userDetails,
  closeInfoModal,
  setShowThankYouModal,
}: UpgradeGroupModalProps) => {
  const { startPayment } = useRazorpayPayment();
  const dispatch = useAppDispatch();

  const handleUpgradeGroup = async () => {
    console.log('test');
    onOpenChange(false);
    closeInfoModal();
    const subscriptionSuccess = await startPayment({
      amount: 99,
      feature: 'premium_group',
      recipientName: userDetails.name ?? 'bro chat user',
      recipientEmail: userDetails.email ?? 'user@brochat.com',
      conversationId,
    });

    if (subscriptionSuccess) {
      dispatch(makeGroupPremium({ conversationId }));
      setShowThankYouModal();
    }
  };

  return (
    <CustomModals
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={() => {}}
      isNormal={false}
    >
      <div className="p-4 sm:p-6">
        <h2 className="text-xl font-semibold text-center mb-2">
          Upgrade to Premium Group
        </h2>
        <p className="text-sm text-center text-gray-600 mb-4">
          Unlock exclusive features and grow your community like a pro.
        </p>

        <div className="grid gap-3 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-medium">✔</span>
            Add <strong>unlimited members</strong> to your group
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-medium">✔</span>
            Assign <strong>unlimited group admins</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-medium">✔</span>
            Get a <strong>blue verification tick</strong> for trust & visibility
          </div>
          {/* <div className="flex items-center gap-2">
            <span className="text-blue-600 font-medium">✔</span>
            Share a <strong>group invite link</strong> publicly
          </div> */}
        </div>

        <div className="mt-6">
          <Button
            className="w-full text-base py-2 flex items-center justify-center gap-2"
            onClick={handleUpgradeGroup}
          >
            Upgrade Now –{' '}
            <span className="text-gray-400 line-through text-sm">₹299</span>
            <span className="text-green-500 font-semibold">₹99 Only</span>
          </Button>
          <p className="text-xs text-gray-500 text-center mt-2">
            One-time payment only. Unlock all benefits instantly.
          </p>
        </div>
      </div>
    </CustomModals>
  );
};

export default UpgradeGroupModal;
