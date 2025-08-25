import { Button } from '@client/components/ui/button';
import CustomModals from '@client/components/customUi/commonElemets/CustomModals';
import { CheckCircle2, Sparkles } from 'lucide-react';

type ThankYouForSubscribingModalProps = {
  open: boolean;
  onClose: () => void;
};

const ThankYouForSubscribingModal = ({
  open,
  onClose,
}: ThankYouForSubscribingModalProps) => {
  return (
    <CustomModals
      open={open}
      onOpenChange={onClose}
      onConfirm={() => {}}
      isNormal={false}
    >
      <div className="p-5 sm:p-6 text-center space-y-6 max-w-md mx-auto">
        <div className="flex flex-col items-center">
          <CheckCircle2 className="text-green-600 w-10 h-10 mb-2" />
          <h2 className="text-xl font-semibold text-green-700">
            Thank You for Your Support!
          </h2>
          <p className="text-sm text-gray-700 mt-1">
            We're excited to have you on board with premium access.
          </p>
        </div>

        <div className="space-y-3 text-sm text-gray-700 text-left mx-auto w-fit">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span>Enjoy exclusive features and priority access.</span>
          </div>

          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span>Thank you for supporting us!</span>
          </div>
        </div>

        <Button onClick={onClose} className="w-full mt-4">
          Let's Go
        </Button>
      </div>
    </CustomModals>
  );
};

export default ThankYouForSubscribingModal;
