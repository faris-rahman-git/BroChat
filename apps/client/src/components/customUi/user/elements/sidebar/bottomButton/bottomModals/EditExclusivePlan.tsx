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
  const {
    customPlan,
    setCustomPlan,
    errorMessage,
    handleSave,
  } = useEditExclusivePlanHook(onClose, exclusivePlan, setExclusivePlan);

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
          {errorMessage && (
            <div className="text-red-600 text-sm mt-1 text-center">
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

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Plan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EditExclusivePlan;
