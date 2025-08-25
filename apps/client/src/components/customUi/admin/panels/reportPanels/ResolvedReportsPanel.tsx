import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { ReportSubResponse } from '@bro/shared';
import DataTable from '@client/components/customUi/commonElemets/DataTable';
import ConfirmActionButton from '@client/components/customUi/commonElemets/ConfirmActionButton';
import ReportDetailsModalContent from '../../elements/reportElements/ReportDetailsModalContent';
import { LuMenu } from 'react-icons/lu';
import { useResolvedReportsPanelHook } from '@client/hooks/PageHooks/admin/report/useResolvedReportsPanelHook';

function ResolvedReportsPanel() {
  const {
    isPending,
    mutate,
    reportList,
    searchValue,
    setSearchValue,
    totalPages,
  } = useResolvedReportsPanelHook();

  const columnHelper = createColumnHelper<ReportSubResponse>();

  const columns = [
    {
      header: '#',
      cell: (info: CellContext<ReportSubResponse, unknown>) => {
        return <span>{info.row.index + 1}</span>;
      },
    },
    columnHelper.accessor('_id', { header: 'Id' }),
    columnHelper.accessor('reportedUserId.username', { header: 'Reported' }),
    columnHelper.accessor('createdAt', {
      header: 'Reported At',
      cell: (info: CellContext<ReportSubResponse, unknown>) => {
        const date = new Date(info.getValue() as string);
        const formatted = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
        return <span>{formatted}</span>;
      },
    }),
    columnHelper.accessor('reason', { header: 'Reason' }),
    {
      header: 'Actions',
      cell: (info: CellContext<ReportSubResponse, unknown>) => {
        const rowData = info.row.original;

        return (
          <div className="flex gap-4 justify-center items-center">
            <ConfirmActionButton
              key={rowData._id}
              buttonIcon={LuMenu}
              buttonClassName="bg-blue-700 hover:bg-blue-800"
              buttonContent="Details"
              modalTitle="Report Details"
              dialogClassName="sm:max-w-[700px]"
              isConfirmButtonDisabled={true}
              onConfirm={() => {}}
            >
              <ReportDetailsModalContent
                report={rowData}
                isShowActions={true}
              />
            </ConfirmActionButton>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={reportList}
      setSearchValue={setSearchValue}
      searchValue={searchValue}
      isPending={isPending}
      tableHeader="Resolved Reports"
      totalPages={totalPages}
      onPageChange={(page: number) => mutate({ searchValue, page })}
    />
  );
}

export default ResolvedReportsPanel;
