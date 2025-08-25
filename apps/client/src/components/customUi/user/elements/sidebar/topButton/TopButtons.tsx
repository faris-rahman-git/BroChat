import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import { TopButtonsConstants } from '@client/constants/userConstant/sidebarConstants';
import { useTopButtonsHook } from '@client/hooks/PageHooks/user/HomePage/HomeLayoutSideBar/TopButtons/useTopButtonsHook';

function TopButtons({
  setIsExpanded,
  isExpanded,
}: {
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isExpanded: boolean;
}) {
  
  const { activeSectionTab, handleButtons } = useTopButtonsHook(
    setIsExpanded,
    isExpanded
  );

  return (
    <div className="flex flex-col gap-7 items-start ps-[6px] w-full">
      {TopButtonsConstants.map(({ icon: Icon, label }, index) => (
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
