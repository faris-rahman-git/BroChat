import AllUsersPanel from '@client/components/customUi/admin/panels/AllUsersPanel';
import DashBoardPanel from '@client/components/customUi/admin/panels/DashBoardPanel';
import DeletedUsersPanel from '@client/components/customUi/admin/panels/DeletedUsersPanel';
import { RootState } from '@client/redux/store';
import { useSelector } from 'react-redux';

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
    </>
  );
}

export default DashBoard;
