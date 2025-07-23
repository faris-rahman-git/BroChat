import React from 'react';
import DashboardSideBar from '@client/components/customUi/admin/panels/mainPanels/DashboardSideBar';

function DashBoardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen bg-[#F3F3F3] flex flex-row">
      <DashboardSideBar />
      <div className="flex-1 flex flex-row h-full min-w-[400px]">
        {children}
      </div>
    </div>
  );
}

export default DashBoardLayout;
