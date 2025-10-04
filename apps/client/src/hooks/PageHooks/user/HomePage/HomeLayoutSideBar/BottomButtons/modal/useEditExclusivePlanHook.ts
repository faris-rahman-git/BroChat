import { planSchema, PlanSchemaType, PlanType } from '@bro/shared';
import { useEditExclusivePlan } from '@client/hooks/home/planHookes/api/useEditExclusivePlan';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export const useEditExclusivePlanHook = (
  onClose: () => void,
  exclusivePlan: PlanType | null,
  setExclusivePlan: (plan: PlanType | null) => void
) => {
  const { mutate: editExclusivePlanMutate } = useEditExclusivePlan();

  const handleSave = (data: PlanSchemaType) => {
    editExclusivePlanMutate({
      data,
      exclusivePlanId: exclusivePlan?._id as string,
    });

    setExclusivePlan({
      ...exclusivePlan,
      name: data.planName,
      description: data.description,
      price: Number(data.price),
      offerPrice: Number(data.offerPrice),
    } as PlanType);

    onClose();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PlanSchemaType>({
    resolver: zodResolver(planSchema),
  });

  useEffect(() => {
    if (exclusivePlan) {
      reset({
        planName: exclusivePlan.name,
        description: exclusivePlan.description,
        price: String(exclusivePlan.price),
        offerPrice: String(exclusivePlan.offerPrice),
      });
    }
  }, [exclusivePlan]);

  return {
    handleSave,
    errors,
    register,
    handleSubmit,
  };
};
