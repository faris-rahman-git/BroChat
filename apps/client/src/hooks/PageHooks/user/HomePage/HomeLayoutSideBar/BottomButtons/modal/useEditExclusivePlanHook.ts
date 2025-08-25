import { PlanType } from '@bro/shared';
import { useEditExclusivePlan } from '@client/hooks/home/planHookes/api/useEditExclusivePlan';
import { useEffect, useState } from 'react';

export const useEditExclusivePlanHook = (
  onClose: () => void,
  exclusivePlan: PlanType | null,
  setExclusivePlan: (plan: PlanType | null) => void
) => {
  const [customPlan, setCustomPlan] = useState({
    planName: '',
    description: '',
    price: '',
    offerPrice: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (exclusivePlan) {
      setCustomPlan({
        planName: exclusivePlan.name,
        description: exclusivePlan.description,
        price: String(exclusivePlan.price),
        offerPrice: String(exclusivePlan.offerPrice),
      });
    }
  }, [exclusivePlan]);

  const { mutate: editExclusivePlanMutate } = useEditExclusivePlan();

  const handleSave = () => {
    if (!customPlan.planName.trim() || !customPlan.description.trim()) {
      setErrorMessage('Plan name and description are required.');
      return;
    }
    if (!customPlan.price || Number(customPlan.price) <= 0) {
      setErrorMessage('Please enter a valid price.');
      return;
    }
    setErrorMessage('');

    // Save updated plan
    editExclusivePlanMutate({
      _id: exclusivePlan?._id as string,
      name: customPlan.planName,
      description: customPlan.description,
      price: Number(customPlan.price),
      offerPrice: Number(customPlan.offerPrice),
    });

    setExclusivePlan({
      ...exclusivePlan,
      name: customPlan.planName,
      description: customPlan.description,
      price: Number(customPlan.price),
      offerPrice: Number(customPlan.offerPrice),
    } as PlanType);

    onClose();
  };

  return {
    customPlan,
    setCustomPlan,
    errorMessage,
    handleSave,
  };
};
