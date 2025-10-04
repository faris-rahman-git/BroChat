import { Card, CardContent, CardHeader } from '@client/components/ui/card';
import { Input } from '@client/components/ui/input';
import { Label } from '@client/components/ui/label';
import { Textarea } from '@client/components/ui/textarea';
import { Button } from '@client/components/ui/button';
import { PlanType } from '@bro/shared';
import { useEditExclusivePlanHook } from '@client/hooks/PageHooks/user/HomePage/HomeLayoutSideBar/BottomButtons/modal/useEditExclusivePlanHook';

function EditExclusivePlan({
  open,
  onClose,
  exclusivePlan,
  setExclusivePlan,
}: {
  open: boolean;
  onClose: () => void;
  exclusivePlan: PlanType | null;
  setExclusivePlan: (plan: PlanType | null) => void;
}) {
  const { handleSave, errors, register, handleSubmit } =
    useEditExclusivePlanHook(onClose, exclusivePlan, setExclusivePlan);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <Card className="border-2 w-full max-w-lg bg-white shadow-lg">
        <CardHeader className="space-y-1">
          <h3 className="font-semibold leading-none text-lg">
            Edit Your Custom Plan
          </h3>
          <p className="text-sm text-gray-500">
            Design your exclusive membership plan with custom pricing and
            features.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
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
              {...register('description')}
              rows={3}
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

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(handleSave)}>Save Plan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EditExclusivePlan;
