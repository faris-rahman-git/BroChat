import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import { useLogoutForm } from '@client/hooks/auth/logic/useLogoutForm';
import { LuLogOut } from 'react-icons/lu';

function DashBoardBottomButtons() {
  const { appLogout } = useLogoutForm();

  return (
    <div className="flex flex-col gap-6 pb-[20px]  w-full">
      <ButtonIcon
        Icon={LuLogOut}
        label={'Logout'}
        onClick={() => appLogout()}
        className="justify-start ps-[9px] w-auto h-[50px]"
      >
        <span className="whitespace-nowrap">Logout</span>
      </ButtonIcon>
    </div>
  );
}

export default DashBoardBottomButtons;
