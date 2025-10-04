import { useState, useEffect } from 'react';
import { PlanType } from '@bro/shared';
import { useGetAllPlansForm } from '@client/hooks/admin/planHooks/logic/useGetAllPlansForm';
import { useSaveNewSubscriptionPlanForm } from '@client/hooks/admin/planHooks/logic/useSaveNewSubscriptionPlanForm';
import { useUpdateSubscriptionPlanForm } from '@client/hooks/admin/planHooks/logic/useUpdateSubscriptionPlanForm';

export const usePlanManageMentPanelHook = (selectedChild: string) => {
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [editingPlan, setEditingPlan] = useState<PlanType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    offerPrice: '',
    duration: '',
    description: '',
    isActive: false,
  });

  const { mutatePlans } = useGetAllPlansForm(setPlans);
  const { mutateNewPlan } = useSaveNewSubscriptionPlanForm(setPlans);
  const { mutateUpdatePlan } = useUpdateSubscriptionPlanForm(setPlans);

  useEffect(() => {
    mutatePlans(selectedChild);
  }, []);

  const handleOpenModal = (plan?: PlanType) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        price: String(plan.price),
        offerPrice: String(plan.offerPrice),
        duration: String(plan.duration),
        description: plan.description,
        isActive: plan.isActive,
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        price: '',
        offerPrice: '',
        duration: '',
        description: '',
        isActive: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
    setErrorMessage('');
    setFormData({
      name: '',
      price: '',
      offerPrice: '',
      duration: '',
      description: '',
      isActive: false,
    });
  };

  const handleSave = () => {
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      formData.price === '' ||
      formData.offerPrice === '' ||
      formData.duration === ''
    ) {
      setErrorMessage(
        'Oops! Looks like some fields are missing. Please fill out all required information.'
      );
      return;
    }

    if (formData.name.trim().length > 30) {
      setErrorMessage('Plan name must be less than 30 characters.');
      return;
    }

    if (formData.description.trim().length > 200) {
      setErrorMessage('Plan description must be less than 50 characters.');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      offerPrice: Number(formData.offerPrice),
      duration: Number(formData.duration),
    };

    if (editingPlan) {
      mutateUpdatePlan({
        data: { _id: editingPlan._id, ...payload },
        selectedChild,
      });
    } else {
      mutateNewPlan(payload);
    }
    handleCloseModal();
  };

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    handleOpenModal,
    handleSave,
    handleInputChange,
    handleCloseModal,
    plans,
    isModalOpen,
    errorMessage,
    editingPlan,
    formData,
    setIsModalOpen,
  };
};
