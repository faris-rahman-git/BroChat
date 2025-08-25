import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import { useDashBoardTopButtonsHook } from '@client/hooks/PageHooks/admin/main/sub/useDashBoardTopButtonsHook';
import { LuUser, LuUserX, LuUsers, LuWallet } from 'react-icons/lu';
import {
  MdArrowDropDown,
  MdOutlineDashboard,
  MdArrowDropUp,
  MdOutlinePayment,
  MdOutlineManageAccounts,
  MdOutlineReportProblem,
  MdOutlineCheckCircle,
  MdOutlineDeleteForever,
  MdGroups2,
  MdOutlineGroupOff,
  MdGroups3,
  MdSubscriptions,
  MdGroup,
  MdVerifiedUser,
  MdOutlinePaid,
  MdAttachMoney,
} from 'react-icons/md';

function DashBoardTopButtons() {
  const buttons = [
    {
      icon: MdOutlineDashboard,
      label: 'Dashboard',
      children: [],
    },
    {
      icon: LuUser,
      label: 'User Management',
      children: [
        { label: 'All Users', icon: LuUsers },
        { label: 'Deleted Users', icon: LuUserX },
      ],
    },
    {
      icon: MdOutlineManageAccounts,
      label: 'Reports Management',
      children: [
        { label: 'Pending Reports', icon: MdOutlineReportProblem },
        { label: 'Resolved Reports', icon: MdOutlineCheckCircle },
        { label: 'Deleted Reports', icon: MdOutlineDeleteForever },
      ],
    },
    {
      icon: MdGroups2,
      label: 'Group Management',
      children: [
        { label: 'All Groups', icon: MdGroups3 },
        { label: 'Deleted Groups', icon: MdOutlineGroupOff },
      ],
    },
    {
      icon: LuWallet,
      label: 'Plan Management',
      children: [
        {
          label: 'Subscriptions',
          icon: MdSubscriptions,
        },
        {
          label: 'Paid Groups',
          icon: MdGroup,
        },
        {
          label: 'Exclusive User',
          icon: MdVerifiedUser,
        },
      ],
    },

    {
      icon: MdOutlinePaid,
      label: 'Revenue Management',
      children: [
        {
          label: 'All Transactions',
          icon: MdOutlinePayment,
        },
        {
          label: 'Exclusive User Payments',
          icon: MdAttachMoney,
        },
      ],
    },
  ];

  const {
    handleButtons,
    handleChildClick,
    selectedTab,
    selectedChild,
    activeDropdown,
  } = useDashBoardTopButtonsHook();

  return (
    <div className="flex flex-col gap-4 border-t-[.2px] pt-[25px] border-[#E0E0E0] w-full">
      {buttons.map(({ icon: Icon, label, children }, index) => {
        const isParentActive =
          selectedTab === label ||
          (label === 'Dashboard' && selectedTab === 'Dashboard');
        return (
          <div key={index} className="flex flex-col">
            <ButtonIcon
              Icon={Icon}
              label={label}
              onClick={() => handleButtons(label, children.length)}
              className={`justify-start ps-[9px] w-auto h-[50px] ${
                isParentActive ? 'bg-[#f5f5f5]' : ''
              }`}
            >
              <div className="flex w-full justify-between items-center">
                <span className="whitespace-nowrap">{label}</span>
                {children.length > 0 && (
                  <span className="pe-2">
                    {activeDropdown === label ? (
                      <MdArrowDropUp />
                    ) : (
                      <MdArrowDropDown />
                    )}
                  </span>
                )}
              </div>
            </ButtonIcon>

            {activeDropdown === label && children.length > 0 && (
              <div className="ms-7 mt-5 flex flex-col gap-6">
                {children.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleChildClick(label, item.label)}
                    className={`text-sm cursor-pointer flex items-center gap-2 px-1 py-[2px] rounded
                      ${
                        selectedChild === item.label
                          ? 'text-black font-semibold'
                          : 'text-gray-700 hover:text-black hover:font-semibold'
                      }`}
                  >
                    <item.icon className="text-lg" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default DashBoardTopButtons;
