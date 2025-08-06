import { Button } from '@client/components/ui/button';
import CustomModals from '@client/components/customUi/commonElemets/CustomModals';
import { UserReduxType } from '@client/types/ReduxTypes';
import { CheckCircle, CalendarDays, Crown, CalendarCheck } from 'lucide-react';

type AlreadySubscribedModalProps = {
  open: boolean;
  onClose: () => void;
  userDetails: UserReduxType;
};

const AlreadySubscribedModal = ({
  open,
  onClose,
  userDetails,
}: AlreadySubscribedModalProps) => {
  return (
    <CustomModals
      open={open}
      onOpenChange={onClose}
      onConfirm={() => {}}
      isNormal={false}
    >
      <div className="p-5 sm:p-6 text-center space-y-6 max-w-md mx-auto">
        <div className="flex flex-col items-center">
          <CheckCircle className="text-green-600 w-10 h-10 mb-2" />
          <h2 className="text-xl font-semibold text-green-600">
            You're Already Premium!
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Thank you for subscribing to the{' '}
            <strong className="text-black">
              {userDetails.subscriptionPlan}
            </strong>{' '}
            plan.
          </p>
        </div>

        <div className="space-y-4 text-sm text-gray-700 text-left mx-auto w-fit border rounded-xl p-6 shadow hover:shadow-lg transition-all">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-purple-600" />
            <span>
              <strong>Premium features</strong> unlocked
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-blue-600" />
            <span>
              <strong>Plan Type:</strong> {userDetails.subscriptionPlan ?? '—'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            <span>
              <strong>Start Date:</strong>{' '}
              {new Date(userDetails.subscriptionStart ?? '').toDateString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-red-600" />
            <span>
              <strong>End Date:</strong>{' '}
              {new Date(userDetails.subscriptionEnd ?? '').toDateString()}
            </span>
          </div>
        </div>

        <Button onClick={onClose} className="w-full mt-2">
          Got it
        </Button>
      </div>
    </CustomModals>
  );
};

export default AlreadySubscribedModal;
