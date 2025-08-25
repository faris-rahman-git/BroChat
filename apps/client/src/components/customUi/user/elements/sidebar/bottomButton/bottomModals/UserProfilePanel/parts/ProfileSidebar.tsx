import { Button } from '@client/components/ui/button';
import { UserReduxType } from '@client/types/ReduxTypes';
import React from 'react';
import { LuUser, LuUserMinus } from 'react-icons/lu';
import { MdHelpOutline, MdOutlinePayments } from 'react-icons/md';

function ProfileSidebar({
  userDetails,
  setSelectedTab,
  selectedTab,
}: {
  userDetails: UserReduxType;
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>
  selectedTab: string;
}) {
  const menuItems = [
    { icon: <LuUser size={20} />, label: 'Profile' },
    { icon: <LuUserMinus size={20} />, label: 'Exclusive' },
    { icon: <MdOutlinePayments size={20} />, label: 'Transactions' },
    { icon: <MdHelpOutline size={20} />, label: 'Help' },
  ];

  return (
    <div className="w-[200px] h-full bg-[#f5f5f5] border-r border-gray-300 flex flex-col p-2">
      {menuItems
        .filter((item) => {
          if (item.label === 'Transactions') {
            return userDetails.isExclusive;
          }
          return true;
        })
        .map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            onClick={() => setSelectedTab(item.label)}
            className={`flex items-center justify-start h-11 w-full rounded-md mb-1 px-3 text-sm font-medium ${
              selectedTab === item.label ? 'bg-[#d1d1d1]' : 'hover:bg-[#e8e8e8]'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.label}</span>
          </Button>
        ))}
    </div>
  );
}

export default React.memo(ProfileSidebar);
