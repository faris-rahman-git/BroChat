import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useLogout } from '@client/hooks/auth/useLogout';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useEffect, useState } from 'react';
import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import { LuArrowBigUpDash, LuLogOut, LuSettings } from 'react-icons/lu';
import { logout } from '@client/redux/features/userSlices/authSlices/userSlice';
import SubscriptionPlansModal from './SubscriptionPlansModal';
import { useSelector } from 'react-redux';
import { RootState } from '@client/redux/store';
import AlreadySubscribedModal from './AlreadySubscribedModal';
import ThankYouForSubscribingModal from '@client/components/customUi/commonElemets/ThankYouForSubscribingModal';
import UserProfilePanel from './UserProfilePanel';

function BottomButtons({ isExpanded }: { isExpanded: boolean }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isPending, isSuccess, mutate } = useLogout();
  const [showPlans, setShowPlans] = useState(false);
  const [showSubscribedModal, setShowSubscribedModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const userDetails = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(logout());
      navigate('/login');
    }
  }, [isSuccess, navigate]);

  return (
    <div className="flex flex-col gap-7 items-start ps-[6px] w-full ">
      <ButtonIcon
        Icon={LuArrowBigUpDash}
        label="Settings"
        onClick={() => {
          userDetails?.isSubscribed
            ? setShowSubscribedModal(true)
            : setShowPlans(true);
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

      <ButtonIcon Icon={LuLogOut} label="Logout" onClick={() => mutate()} />

      <SubscriptionPlansModal
        open={showPlans}
        onClose={() => setShowPlans(false)}
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
        logOut={mutate}
      />
    </div>
  );
}

export default BottomButtons;
