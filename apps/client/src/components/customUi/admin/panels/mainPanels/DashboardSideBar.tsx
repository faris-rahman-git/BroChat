import React from 'react';
import DashBoardSidebarLogo from '../../elements/sidebar/DashBoardSidebarLogo';
import DashBoardTopButtons from '../../elements/sidebar/DashBoardTopButtons';
import DashBoardBottomButtons from '../../elements/sidebar/DashBoardBottomButtons';

function DashboardSideBar() {
  return (
    <nav className="h-screen w-63 select-none bg-white shadow-[0px_0px_24px_#00000014] z-2 py-4 px-4 flex flex-col justify-between">
      <div className="inline-flex flex-col gap-6">
        <DashBoardSidebarLogo />
        <DashBoardTopButtons />
      </div>

      <DashBoardBottomButtons />
    </nav>
  );
}

export default React.memo(DashboardSideBar);
