import { FC, useState } from 'react';
import { Button } from '@client/components/ui/button';
import { Input } from '@client/components/ui/input';
import { Label } from '@client/components/ui/label';
import { Textarea } from '@client/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@client/components/ui/card';
import { PlanType } from '@bro/shared';
import { UserReduxType } from '@client/types/ReduxTypes';
import { useExclusiveMakePlanTabHook } from '@client/hooks/PageHooks/user/HomePage/HomeLayoutSideBar/BottomButtons/modal/useExclusiveMakePlanTabHook';
import axios from 'axios';

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
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    exclusivePlan,
    handlePaymentAndSavePlan,
    register,
    errors,
    handleSubmit,
    createPlanError,
  } = useExclusiveMakePlanTabHook(
    setExclusivePlanKid,
    setShowThankYouModal,
    onClose,
    userDetails
  );

  const handlePaymentClick = handleSubmit(async (data) => {
    if (isProcessing) return;

    setIsProcessing(true);
    await handlePaymentAndSavePlan(data, exclusivePlan?.offerPrice ?? 199);
    setTimeout(() => setIsProcessing(false), 3000);
  });

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

        {axios.isAxiosError(createPlanError) && (
          <div className="mb-4">
            <p className="text-sm text-red-500 text-center">
              {createPlanError.response?.data?.message}
            </p>
          </div>
        )}

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
            <div className="space-y-2">
              <Label htmlFor="planName">Plan Name</Label>
              <Input
                id="planName"
                placeholder="Enter your plan name"
                {...register('planName')}
              />
              <span className="text-[#FF0000] text-[12px] block capitalize">
                {String(errors['planName']?.message ?? '\u00A0')}
              </span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your plan features and benefits"
                rows={3}
                {...register('description')}
              />
              <span className="text-[#FF0000] text-[12px] block capitalize">
                {String(errors['description']?.message ?? '\u00A0')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  {...register('price')}
                />
                <span className="text-[#FF0000] text-[12px] block capitalize">
                  {String(errors['price']?.message ?? '\u00A0')}
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="offerPrice">Offer Price</Label>
                <Input
                  id="offerPrice"
                  type="number"
                  placeholder="0.00"
                  {...register('offerPrice')}
                />
                <span className="text-[#FF0000] text-[12px] block capitalize">
                  {String(errors['offerPrice']?.message ?? '\u00A0')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center w-full justify-end pt-4 border-t mt-4">
          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button onClick={handlePaymentClick} className="w-fit">
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
