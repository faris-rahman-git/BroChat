import { FC } from 'react';
import { Button } from '@client/components/ui/button';
import { Input } from '@client/components/ui/input';
import { Label } from '@client/components/ui/label';
import { Textarea } from '@client/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@client/components/ui/card';
import { PlanType } from '@bro/shared';
import { UserReduxType } from '@client/types/ReduxTypes';
import { useExclusiveMakePlanTabHook } from '@client/hooks/PageHooks/user/HomePage/HomeLayoutSideBar/BottomButtons/modal/useExclusiveMakePlanTabHook';

interface CustomPlanModalProps {
  open: boolean;
  onClose: () => void;
  userDetails: UserReduxType;
  setExclusivePlanKid: (plan: PlanType | null) => void;
  setShowThankYouModal: () => void;
}

const ExclusiveMakePlanTab: FC<CustomPlanModalProps> = ({
  open,
  onClose,
  userDetails,
  setExclusivePlanKid,
  setShowThankYouModal,
}) => {
  const {
    errorMessage,
    exclusivePlan,
    handlePaymentAndSavePlan,
    setCustomPlan,
    customPlan,
  } = useExclusiveMakePlanTabHook(
    setExclusivePlanKid,
    setShowThankYouModal,
    onClose,
    userDetails
  );

  if (!open) return <></>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="sm:max-w-lg bg-white rounded-md p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-center">
            {exclusivePlan?.name}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {exclusivePlan?.description}
          </p>
        </div>

        <Card className="border-2 mt-4">
          <CardHeader className="space-y-1">
            <h3 className="font-semibold leading-none">
              Create Your Custom Plan
            </h3>
            <p className="text-sm text-muted-foreground">
              Design your exclusive membership plan with custom pricing and
              features
            </p>
          </CardHeader>
          <CardContent className=" space-y-4">
            {errorMessage && (
              <div className="text-red-600 text-sm mt-1 text-center p-0 m-0">
                {errorMessage}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="planName">Plan Name</Label>
              <Input
                id="planName"
                placeholder="Enter your plan name"
                value={customPlan.planName}
                onChange={(e) =>
                  setCustomPlan((prev) => ({
                    ...prev,
                    planName: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your plan features and benefits"
                value={customPlan.description}
                onChange={(e) =>
                  setCustomPlan((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={customPlan.price}
                  onChange={(e) =>
                    setCustomPlan((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="offerPrice">Offer Price</Label>
                <Input
                  id="offerPrice"
                  type="number"
                  placeholder="0.00"
                  value={customPlan.offerPrice}
                  onChange={(e) =>
                    setCustomPlan((prev) => ({
                      ...prev,
                      offerPrice: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center w-full justify-end pt-4 border-t mt-4">
          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={() =>
                handlePaymentAndSavePlan(exclusivePlan?.offerPrice ?? 199)
              }
              className="w-fit"
            >
              Continue & Pay –{' '}
              <span className="text-gray-400 line-through text-sm">
                ₹{exclusivePlan?.price}
              </span>
              <span className="text-green-500 font-semibold">
                ₹{exclusivePlan?.offerPrice} Only
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExclusiveMakePlanTab;
