import DashBoard from '@client/components/features/admin/DashBoard';
import DashBoardLayout from '@client/layouts/DashBoardLayout';

function DashboardPage() {
  return (
    <DashBoardLayout>
      <DashBoard />
    </DashBoardLayout>
  );
}

export default DashboardPage;
