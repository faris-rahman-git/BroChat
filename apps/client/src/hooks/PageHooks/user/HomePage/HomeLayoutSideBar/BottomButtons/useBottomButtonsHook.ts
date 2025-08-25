import { useLogoutForm } from '@client/hooks/auth/logic/useLogoutForm';
import { useGetPlansForm } from '@client/hooks/home/planHookes/logic/useGetPlansForm';
import { RootState } from '@client/redux/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PlanType } from '@bro/shared';

export const useBottomButtonsHook = () => {
  const [showPlans, setShowPlans] = useState(false);
  const [showSubscribedModal, setShowSubscribedModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditExclusivePlanModalOpen, setEditExclusivePlanModalOpen] =
    useState(false);
  const [isExclusiveMakePlanModalOpen, setExclusiveMakePlanModalOpen] =
    useState(false);
  const [exclusivePlan, setExclusivePlan] = useState<PlanType | null>(null);

  const userDetails = useSelector((state: RootState) => state.user);

  const { appLogout } = useLogoutForm();

  const { getPlanMutate } = useGetPlansForm(setExclusivePlan);

  useEffect(() => {
    getPlanMutate('exclusive_user_customer');
  }, []);

  return {
    showPlans,
    setShowPlans,
    showSubscribedModal,
    setShowSubscribedModal,
    showThankYouModal,
    setShowThankYouModal,
    isModalOpen,
    setModalOpen,
    isEditExclusivePlanModalOpen,
    setEditExclusivePlanModalOpen,
    isExclusiveMakePlanModalOpen,
    setExclusiveMakePlanModalOpen,
    userDetails,
    appLogout,
    exclusivePlan,
    setExclusivePlan,
  };
  
};
