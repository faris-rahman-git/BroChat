import { Button } from '@client/components/ui/button';
import { Dialog, DialogContent } from '@client/components/ui/dialog';
import { AlertTriangle, Lock } from 'lucide-react';

type ExpiredSubscriptionModalProps = {
  open: boolean;
  onClose: () => void;
  onRenew?: () => void;
};

const ExpiredSubscriptionModal = ({
  open,
  onClose,
  onRenew,
}: ExpiredSubscriptionModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="p-5 sm:p-6 text-center space-y-6 max-w-md mx-auto">
          <div className="flex flex-col items-center">
            <AlertTriangle className="text-red-600 w-10 h-10 mb-2" />
            <h2 className="text-xl font-semibold text-red-700">
              Subscription Expired
            </h2>
            <p className="text-sm text-gray-700 mt-1">
              Your premium access has expired. Renew to continue enjoying all
              features.
            </p>
          </div>

          <div className="space-y-3 text-sm text-gray-700 text-left mx-auto w-fit">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-500" />
              <span>Premium features are now locked</span>
            </div>

            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-500" />
              <span>Priority support unavailable</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => {
                onRenew?.();
                onClose();
              }}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Renew Subscription
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full bg-transparent"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpiredSubscriptionModal;
