import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import { LuArrowBigUpDash, LuLogOut, LuSettings } from 'react-icons/lu';
import ThankYouForSubscribingModal from '@client/components/customUi/commonElemets/ThankYouForSubscribingModal';
import SubscriptionPlansModal from './bottomModals/SubscriptionPlansModal';
import AlreadySubscribedModal from './bottomModals/AlreadySubscribedModal';
import { useBottomButtonsHook } from '@client/hooks/PageHooks/user/HomePage/HomeLayoutSideBar/BottomButtons/useBottomButtonsHook';
import UserProfilePanel from './bottomModals/UserProfilePanel';
import ExclusiveMakePlanTab from './bottomModals/ExclusiveMakePlanTab';
import EditExclusivePlan from './bottomModals/EditExclusivePlan';
import { setShowSubscriptionPlans } from '@client/redux/features/userSlices/homeSlices/commonSlices/subscriptionPlanSlice';

function BottomButtons({ isExpanded }: { isExpanded: boolean }) {
  const {
    showPlans,
    dispatch,
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
  } = useBottomButtonsHook();

  return (
    <div className="flex flex-col gap-7 items-start ps-[6px] w-full ">
      <ButtonIcon
        Icon={LuArrowBigUpDash}
        label="Settings"
        onClick={() => {
          userDetails?.isSubscribed
            ? setShowSubscribedModal(true)
            : dispatch(setShowSubscriptionPlans({ value: true }));
        }}
        className={`justify-start ps-2 ${
          isExpanded ? 'w-[160px] justify-start' : ''
        }
        ${
          userDetails?.isSubscribed ? 'text-[#615EF0] hover:text-[#615EF0]' : ''
        }`}
      >
        <span
          className={`whitespace-nowrap ${
            isExpanded
              ? 'opacity-100  delay-100 visible'
              : 'opacity-0 delay-0 invisible'
          }`}
        >
          Premium
        </span>
      </ButtonIcon>

      <ButtonIcon
        Icon={LuSettings}
        label="Settings"
        onClick={() => setModalOpen(true)}
        className={`justify-start ps-2  ${
          isExpanded ? 'w-[160px] justify-start' : ''
        }`}
      >
        <span
          className={`whitespace-nowrap ${
            isExpanded
              ? 'opacity-100  delay-100 visible'
              : 'opacity-0 delay-0 invisible'
          }`}
        >
          Settings
        </span>
      </ButtonIcon>
      <div
        className={`flex items-center justify-start ps-1 gap-2 hover:cursor-pointer rounded-[6px] h-[35px] w-[35px] ${
          isExpanded ? 'w-[160px] hover:bg-[#F5F5F5]' : ''
        }`}
        onClick={() => setModalOpen(true)}
      >
        <Avatar
          className={`w-[30px] h-[30px] rounded-[6px] overflow-hidden flex-shrink-0 ${
            !isExpanded ? 'transform hover:scale-110' : ''
          }`}
        >
          <AvatarImage
            src={userDetails.avatar || ''}
            alt={userDetails.name || ''}
            className="w-full h-full object-cover rounded-[6px]"
          />
          <AvatarFallback className="w-full h-full flex items-center justify-center text-center rounded-[6px] bg-[#C9C9C9]">
            {userDetails.name?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>

        <span
          className={`whitespace-nowrap font-medium text-sm text-[#171717] ${
            isExpanded
              ? 'opacity-100  delay-100 visible'
              : 'opacity-0 delay-0 invisible'
          }`}
        >
          Profile
        </span>
      </div>

      <ButtonIcon Icon={LuLogOut} label="Logout" onClick={() => appLogout()} />

      <SubscriptionPlansModal
        open={showPlans}
        onClose={() => dispatch(setShowSubscriptionPlans({ value: false }))}
        setShowThankYouModal={() => setShowThankYouModal(true)}
      />

      <AlreadySubscribedModal
        open={showSubscribedModal}
        onClose={() => setShowSubscribedModal(false)}
        userDetails={userDetails}
      />

      <ThankYouForSubscribingModal
        open={showThankYouModal}
        onClose={() => setShowThankYouModal(false)}
      />

      <UserProfilePanel
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        userDetails={userDetails}
        logOut={appLogout}
        setExclusiveMakePlanModalOpen={() =>
          setExclusiveMakePlanModalOpen(true)
        }
        exclusivePlan={exclusivePlan}
        openEditExclusivePlanModal={() => setEditExclusivePlanModalOpen(true)}
      />

      <ExclusiveMakePlanTab
        open={isExclusiveMakePlanModalOpen}
        onClose={() => setExclusiveMakePlanModalOpen(false)}
        userDetails={userDetails}
        setExclusivePlanKid={setExclusivePlan}
        setShowThankYouModal={() => setShowThankYouModal(true)}
      />

      <EditExclusivePlan
        open={isEditExclusivePlanModalOpen}
        onClose={() => setEditExclusivePlanModalOpen(false)}
        exclusivePlan={exclusivePlan}
        setExclusivePlan={setExclusivePlan}
      />
    </div>
  );
}

export default BottomButtons;
