import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { setActiveSection } from '@client/redux/features/activeSectionTabSlice';
import { RootState } from '@client/redux/store';
import { LuMenu, LuMessageCircleMore, LuPhone, LuUsers } from 'react-icons/lu';
import { useSelector } from 'react-redux';

function TopButtons({
  setIsExpanded,
  isExpanded,
}: {
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isExpanded: boolean;
}) {
  const buttons = [
    { icon: LuMenu, label: 'Menu' },
    { icon: LuMessageCircleMore, label: 'DMs' },
    { icon: LuUsers, label: 'Groups' },
    { icon: LuPhone, label: 'Calls' },
  ];

  const activeSectionTab = useSelector(
    (state: RootState) => state.activeSectionTab.value
  );
  const dispatch = useAppDispatch();

  const handleButtons = (label: string) => {
    if (label === 'Menu') {
      setIsExpanded(!isExpanded);
    } else if (label === 'DMs') {
      dispatch(setActiveSection({ value: 'DMs' }));
    } else if (label === 'Groups') {
      dispatch(setActiveSection({ value: 'Groups' }));
    } else if (label === 'Calls') {
      dispatch(setActiveSection({ value: 'Calls' }));
    }
  };

  return (
    <div className="flex flex-col gap-7 items-start ps-[6px] w-full">
      {buttons.map(({ icon: Icon, label }, index) => (
        <ButtonIcon
          key={index}
          Icon={Icon}
          label={label}
          onClick={() => handleButtons(label)}
          className={`justify-start ps-[9px]  ${
            isExpanded ? 'w-[160px] justify-start' : ''
          } ${activeSectionTab === label ? 'bg-[#f5f5f5]' : ''}`}
        >
          <span
            className={`whitespace-nowrap${
              isExpanded
                ? 'opacity-100 delay-100 visible'
                : 'opacity-0 delay-0 invisible'
            }`}
          >
            {label}
          </span>
        </ButtonIcon>
      ))}
    </div>
  );
}

export default TopButtons;
