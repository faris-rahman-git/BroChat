import { Button } from '@client/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@client/components/ui/card';
import React from 'react';
import { PlanType } from '@bro/shared';

function NonExclusiveUserView({
  exclusivePlan,
  openEditExclusivePlanModal,
}: {
  exclusivePlan: PlanType | null;
  openEditExclusivePlanModal: () => void;
}) {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              {exclusivePlan?.name}
            </CardTitle>
            <CardDescription>{exclusivePlan?.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Price</p>
            <p className="text-lg font-semibold">{exclusivePlan?.price}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Offer Price
            </p>
            <p className="text-lg font-semibold">{exclusivePlan?.offerPrice}</p>
          </div>
        </div>
        <div className="pt-4">
          <Button
            variant="outline"
            className="w-full md:w-auto bg-transparent"
            onClick={openEditExclusivePlanModal}
          >
            Edit Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default React.memo(NonExclusiveUserView);
