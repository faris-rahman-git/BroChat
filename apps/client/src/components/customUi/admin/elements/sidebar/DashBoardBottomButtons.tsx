import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import { useLogout } from '@client/hooks/auth/useLogout';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { showLoader, hideLoader } from '@client/redux/features/LoaderSlice';
import { logout } from '@client/redux/features/userSlice';
import { useEffect } from 'react';
import { LuLogOut } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

function DashBoardBottomButtons() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isPending, isSuccess, mutate } = useLogout();

  useEffect(() => {
    if (isPending) {
      dispatch(showLoader());
    } else {
      dispatch(hideLoader());
    }
  }, [isPending]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(logout());
      navigate('/login');
    }
  }, [isSuccess, navigate]);
  return (
    <div className="flex flex-col gap-6 pb-[20px]  w-full">
      <ButtonIcon
        Icon={LuLogOut}
        label={'Logout'}
        onClick={() => mutate()}
        className="justify-start ps-[9px] w-auto h-[50px]"
      >
        <span className="whitespace-nowrap">Logout</span>
      </ButtonIcon>
    </div>
  );
}

export default DashBoardBottomButtons;
