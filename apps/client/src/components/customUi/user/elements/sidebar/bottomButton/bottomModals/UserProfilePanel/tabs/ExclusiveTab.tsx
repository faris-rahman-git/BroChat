import { UserReduxType } from '@client/types/ReduxTypes';
import ExclusiveUserView from '../parts/ExclusiveTab/ExclusiveUserView';
import NonExclusiveUserView from '../parts/ExclusiveTab/NonExclusiveUserView';
import React from 'react';
import { PlanType } from '@bro/shared';

function ExclusiveTab({
  setExclusiveMakePlanModalOpen,
  userDetails,
  exclusivePlan,
  openEditExclusivePlanModal,
}: {
  setExclusiveMakePlanModalOpen: () => void;
  userDetails: UserReduxType;
  exclusivePlan: PlanType | null;
  openEditExclusivePlanModal: () => void;
}) {
  return (
    <>
      {!userDetails.isExclusive ? (
        <ExclusiveUserView
          setExclusiveMakePlanModalOpen={setExclusiveMakePlanModalOpen}
        />
      ) : (
        <NonExclusiveUserView
          exclusivePlan={exclusivePlan}
          openEditExclusivePlanModal={openEditExclusivePlanModal}
        />
      )}
    </>
  );
}

export default React.memo(ExclusiveTab);
