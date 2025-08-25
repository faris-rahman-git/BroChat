import { Button } from '@client/components/ui/button';
import CustomModals from '@client/components/customUi/commonElemets/CustomModals';
import { UserReduxType } from '@client/types/ReduxTypes';
import { useExclusiveUserModalHook } from '@client/hooks/PageHooks/user/HomePage/Home/panels/ChatPanel/element/useExclusiveUserModalHook';

type ExclusiveUserModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userDetails: UserReduxType;
  receiverId: string;
};

const ExclusiveUserModal = ({
  open,
  onOpenChange,
  userDetails,
  receiverId,
}: ExclusiveUserModalProps) => {
  const { handleUpgradeUser, exclusivePlan } = useExclusiveUserModalHook(
    onOpenChange,
    userDetails,
    receiverId
  );

  return (
    <CustomModals
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={() => {}}
      isNormal={false}
    >
      <div className="p-4 sm:p-6">
        <h2 className="text-xl font-semibold text-center mb-2">
          {exclusivePlan?.name}
        </h2>
        <p className="text-sm text-center text-gray-600 mb-4">
          {exclusivePlan?.description}
        </p>

        <div className="grid gap-3 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-medium">✔</span>
            Unlock <strong>exclusive chat features</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-medium">✔</span>
            Get <strong>priority support</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-medium">✔</span>
            Display <strong>exclusive badge</strong> for trust & visibility
          </div>
        </div>

        <div className="mt-6">
          <Button
            className="w-full text-base py-2 flex items-center justify-center gap-2"
            onClick={handleUpgradeUser}
          >
            Upgrade Now –{' '}
            <span className="text-gray-400 line-through text-sm">
              ₹{exclusivePlan?.price}
            </span>
            <span className="text-green-500 font-semibold">
              ₹{exclusivePlan?.offerPrice} Only
            </span>
          </Button>
          <p className="text-xs text-gray-500 text-center mt-2">
            One-time payment only. Unlock all benefits instantly.
          </p>
        </div>
      </div>
    </CustomModals>
  );
};

export default ExclusiveUserModal;
