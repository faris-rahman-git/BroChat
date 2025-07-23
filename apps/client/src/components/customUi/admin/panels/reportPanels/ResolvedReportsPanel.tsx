import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { ReportResponse } from '@bro/shared';
import DataTable from '@client/components/customUi/commonElemets/DataTable';
import ConfirmActionButton from '@client/components/customUi/commonElemets/ConfirmActionButton';
import ReportDetailsModalContent from '../../elements/reportElements/ReportDetailsModalContent';
import { useGetResolvedReports } from '@client/hooks/admin/reportManagement/useGetResolvedReports';
import { LuMenu } from 'react-icons/lu';

function ResolvedReportsPanel() {
  const [reportList, setReportList] = useState<ReportResponse[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const { isPending, isSuccess, mutate, data } = useGetResolvedReports();
  useEffect(() => {
    mutate();
  }, []);
  //success handles
  useEffect(() => {
    if (isSuccess) {
      setReportList(data.reportList);
    }
  }, [isSuccess]);

  const columnHelper = createColumnHelper<ReportResponse>();

  const columns = [
    {
      header: '#',
      cell: (info: CellContext<ReportResponse, unknown>) => {
        return <span>{info.row.index + 1}</span>;
      },
    },
    columnHelper.accessor('reporterId.username', { header: 'Reporter' }),
    columnHelper.accessor('reportedUserId.username', { header: 'Reported' }),
    columnHelper.accessor('createdAt', {
      header: 'Reported At',
      cell: (info: CellContext<ReportResponse, unknown>) => {
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
      cell: (info: CellContext<ReportResponse, unknown>) => {
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
              <ReportDetailsModalContent report={rowData} isShowActions={true} />
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
    />
  );
}

export default ResolvedReportsPanel;
