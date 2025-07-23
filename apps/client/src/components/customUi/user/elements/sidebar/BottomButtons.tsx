import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import avatar from '@client/assets/defaultAvatar/avatar.webp';
import { useLogout } from '@client/hooks/auth/useLogout';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useEffect } from 'react';
import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import { LuLogOut, LuSettings } from 'react-icons/lu';
import { logout } from '@client/redux/features/userSlices/authSlices/userSlice';

function BottomButtons({ isExpanded }: { isExpanded: boolean }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isPending, isSuccess, mutate } = useLogout();

  useEffect(() => {
    dispatch(isPending ? showLoader() : hideLoader());
  }, [isPending]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(logout());
      navigate('/login');
    }
  }, [isSuccess, navigate]);

  const handleSettings = () => {};

  return (
    <div className="flex flex-col gap-7 items-start ps-[6px] w-full ">
      <ButtonIcon
        Icon={LuSettings}
        label="Settings"
        onClick={handleSettings}
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
        // onClick={}
      >
        <Avatar
          className={`w-[30px] h-[30px] rounded-[6px] overflow-hidden flex-shrink-0 ${
            !isExpanded ? 'transform hover:scale-110' : ''
          }`}
        >
          <AvatarImage src={avatar} alt="Profile" />
          <AvatarFallback>U</AvatarFallback>
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
    </div>
  );
}

export default BottomButtons;
