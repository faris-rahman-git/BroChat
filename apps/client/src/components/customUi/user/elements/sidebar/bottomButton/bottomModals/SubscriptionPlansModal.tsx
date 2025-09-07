import { Button } from '@client/components/ui/button';
import { useSubscriptionPlansModalHook } from '@client/hooks/PageHooks/user/HomePage/HomeLayoutSideBar/BottomButtons/modal/useSubscriptionPlansModalHook';
import { LuX } from 'react-icons/lu';

type SubscriptionPlansModalProps = {
  open: boolean;
  onClose: () => void;
  setShowThankYouModal: () => void;
};

const SubscriptionPlansModal = ({
  open,
  onClose,
  setShowThankYouModal,
}: SubscriptionPlansModalProps) => {
  const { handleSubscribe, subscriptionPlan } = useSubscriptionPlansModalHook(
    open,
    onClose,
    setShowThankYouModal
  );

  if (!open) return <></>;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 "
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl overflow-scroll custom-scrollbar-hidden max-h-[96%] shadow-xl max-w-5xl mx-auto w-[800px] p-6 sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <LuX className="w-5 h-5" />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold text-center mb-2">
          Choose a Subscription Plan
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Unlock premium features with a one-time payment.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/*  Card */}
          {subscriptionPlan.map((plan) => (
            <div
              key={plan._id}
              className="border rounded-xl p-6 shadow hover:shadow-lg transition-all flex flex-col justify-between bg-gray-50"
            >
              <div>
                <h3 className="text-lg font-bold mb-3 text-center">
                  {plan.name}
                </h3>
                <p className="text-xs text-center text-gray-500 mb-4">
                  {plan.description}
                </p>

                <div className="grid gap-3 pb-5 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-medium mt-0.5">✔</span>
                    <span>
                      Get a{' '}
                      <strong className="font-semibold">
                        blue verification tick
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-medium mt-0.5">✔</span>
                    <span>
                      <strong className="font-semibold">Delete messages</strong>{' '}
                      anytime
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-medium mt-0.5">✔</span>
                    <span>
                      <strong className="font-semibold">Edit messages</strong>{' '}
                      anytime
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-medium mt-0.5">✔</span>
                    <span>
                      Set a{' '}
                      <strong className="font-semibold">custom username</strong>
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-medium mt-0.5">✔</span>
                    <span>
                      <strong className="font-semibold">
                        Priority support
                      </strong>{' '}
                      from our team
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-medium mt-0.5">✔</span>
                    <span>
                      <strong className="font-semibold">Early access</strong> to
                      new features
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-medium mt-0.5">✔</span>
                    <span>
                      <strong className="font-semibold">
                        {' '}
                        Just ₹{plan.offerPrice}/{plan.duration} days!
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() =>
                  handleSubscribe(
                    plan.offerPrice,
                    plan.duration as number,
                    plan.name
                  )
                }
                className="w-full"
              >
                Upgrade Now –{' '}
                <span className="text-gray-400 line-through text-sm">
                  ₹{plan.price}
                </span>
                <span className="text-green-500 font-semibold">
                  ₹{plan.offerPrice} Only
                </span>
              </Button>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          One-time payment only. No recurring fees.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPlansModal;
