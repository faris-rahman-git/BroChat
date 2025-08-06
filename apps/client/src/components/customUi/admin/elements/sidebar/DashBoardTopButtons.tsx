import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
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
} from 'react-icons/md';
import { RootState } from '@client/redux/store';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import {
  setActiveDropdown,
  setSelectedChild,
  setSelectedTab,
} from '@client/redux/features/admin/adminSidebarSlice';

function DashBoardTopButtons() {
  const dispatch = useAppDispatch();
  const { selectedTab, selectedChild, activeDropdown } = useSelector(
    (state: RootState) => state.adminSidebar
  );
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
      label: 'Revenue Management',
      children: [
        {
          label: 'All Transactions',
          icon: MdOutlinePayment,
        },
      ],
    },
  ];

  const handleButtons = (label: string, childrenLength: number) => {
    dispatch(setActiveDropdown(activeDropdown === label ? null : label));

    if (childrenLength === 0) {
      dispatch(setSelectedTab(label));
      dispatch(setSelectedChild(null));
    }
  };

  const handleChildClick = (parentLabel: string, childLabel: string) => {
    dispatch(setSelectedTab(parentLabel));
    dispatch(setSelectedChild(childLabel));
  };

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
