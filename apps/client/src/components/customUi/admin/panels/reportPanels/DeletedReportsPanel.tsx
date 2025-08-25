import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { ReportSubResponse } from '@bro/shared';
import DataTable from '@client/components/customUi/commonElemets/DataTable';
import ConfirmActionButton from '@client/components/customUi/commonElemets/ConfirmActionButton';
import ReportDetailsModalContent from '../../elements/reportElements/ReportDetailsModalContent';
import { LuMenu, LuTrash2 } from 'react-icons/lu';
import { useDeletedReportsPanelHook } from '@client/hooks/PageHooks/admin/report/useDeletedReportsPanelHook';

function DeletedReportsPanel() {
  const {
    handleHardDeleteReport,
    isPending,
    mutate,
    reportList,
    searchValue,
    setSearchValue,
    totalPages,
  } = useDeletedReportsPanelHook();

  const columnHelper = createColumnHelper<ReportSubResponse>();

  const columns = [
    {
      header: '#',
      cell: (info: CellContext<ReportSubResponse, unknown>) => {
        return <span>{info.row.index + 1}</span>; // Index starts from 0
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
              buttonIcon={LuTrash2}
              buttonClassName="bg-[#600e0e] hover:bg-[#512e2e]"
              buttonContent="Delete"
              modalTitle="Delete Report Permanently"
              modalDescription="Are you sure you want to delete this report? This action cannot be undone."
              onConfirm={() => handleHardDeleteReport(rowData._id)}
            ></ConfirmActionButton>

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
      tableHeader="Deleted Reports"
      totalPages={totalPages}
      onPageChange={(page: number) => mutate({ searchValue, page })}
    />
  );
}

export default DeletedReportsPanel;
