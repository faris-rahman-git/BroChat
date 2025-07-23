import DashBoardPanel from '@client/components/customUi/admin/panels/dashBoardPanel/DashBoardPanel';
import DeletedUsersPanel from '@client/components/customUi/admin/panels/userPanels/DeletedUsersPanel';
import ReportDetailsPanel from '@client/components/customUi/admin/panels/reportPanels/ReportDetailsPanel';
import AllUsersPanel from '@client/components/customUi/admin/panels/userPanels/AllUsersPanel';
import { RootState } from '@client/redux/store';
import { useSelector } from 'react-redux';
import ResolvedReportsPanel from '@client/components/customUi/admin/panels/reportPanels/ResolvedReportsPanel';
import DeletedReportsPanel from '@client/components/customUi/admin/panels/reportPanels/DeletedReportsPanel';

function DashBoard() {
  const { selectedTab, selectedChild } = useSelector(
    (state: RootState) => state.adminSidebar
  );
  return (
    <>
      {selectedTab == 'Dashboard' && <DashBoardPanel />}
      {selectedTab == 'User Management' && selectedChild == 'All Users' && (
        <AllUsersPanel />
      )}
      {selectedTab == 'User Management' && selectedChild == 'Deleted Users' && (
        <DeletedUsersPanel />
      )}
      {selectedTab == 'Reports Management' &&
        selectedChild == 'Pending Reports' && <ReportDetailsPanel />}
      {selectedTab == 'Reports Management' &&
        selectedChild == 'Resolved Reports' && <ResolvedReportsPanel />}
      {selectedTab == 'Reports Management' &&
        selectedChild == 'Deleted Reports' && <DeletedReportsPanel />}
    </>
  );
}

export default DashBoard;
