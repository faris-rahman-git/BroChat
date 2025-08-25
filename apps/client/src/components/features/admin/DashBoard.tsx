import DeletedUsersPanel from '@client/components/customUi/admin/panels/userPanels/DeletedUsersPanel';
import ReportDetailsPanel from '@client/components/customUi/admin/panels/reportPanels/ReportDetailsPanel';
import AllUsersPanel from '@client/components/customUi/admin/panels/userPanels/AllUsersPanel';
import { RootState } from '@client/redux/store';
import { useSelector } from 'react-redux';
import ResolvedReportsPanel from '@client/components/customUi/admin/panels/reportPanels/ResolvedReportsPanel';
import DeletedReportsPanel from '@client/components/customUi/admin/panels/reportPanels/DeletedReportsPanel';
import AllTransactionsPanel from '@client/components/customUi/admin/panels/revenuePanel/AllTransactionsPanel';
import AllGroups from '@client/components/customUi/admin/panels/groupPanels/AllGroups';
import DeletedGroups from '@client/components/customUi/admin/panels/groupPanels/DeletedGroups';
import PlanManageMentPanel from '@client/components/customUi/admin/panels/PlanPanels/PlanManageMentPanel';
import ExclusiveUserPaymentsPanel from '@client/components/customUi/admin/panels/revenuePanel/ExclusiveUserPaymentsPanel';
import { DashBoardPanel } from '@client/components/customUi/admin/panels/dashBoardPanel/DashBoardPanel';

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

      {selectedTab == 'Group Management' && selectedChild == 'All Groups' && (
        <AllGroups />
      )}
      {selectedTab == 'Group Management' &&
        selectedChild == 'Deleted Groups' && <DeletedGroups />}

      {selectedTab == 'Plan Management' && selectedChild == 'Subscriptions' && (
        <PlanManageMentPanel selectedChild="subscription" />
      )}
      {selectedTab == 'Plan Management' && selectedChild == 'Paid Groups' && (
        <PlanManageMentPanel selectedChild="paid_group" />
      )}
      {selectedTab == 'Plan Management' &&
        selectedChild == 'Exclusive User' && (
          <PlanManageMentPanel selectedChild="exclusive_user" />
        )}
      {selectedTab == 'Revenue Management' &&
        selectedChild == 'All Transactions' && <AllTransactionsPanel />}
      {selectedTab == 'Revenue Management' &&
        selectedChild == 'Exclusive User Payments' && <ExclusiveUserPaymentsPanel />}
    </>
  );
}

export default DashBoard;
