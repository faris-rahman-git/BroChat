import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { ReportSubResponse } from '@bro/shared';
import DataTable from '@client/components/customUi/commonElemets/DataTable';
import ConfirmActionButton from '@client/components/customUi/commonElemets/ConfirmActionButton';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import ReportDetailsModalContent from '../../elements/reportElements/ReportDetailsModalContent';
import { useGetDeletedReports } from '@client/hooks/admin/reportManagement/useGetDeletedReports';
import { LuMenu, LuTrash2 } from 'react-icons/lu';
import { useHardDeleteReport } from '@client/hooks/admin/reportManagement/useHardDeleteReport';

function DeletedReportsPanel() {
  const [reportList, setReportList] = useState<ReportSubResponse[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useAppDispatch();

  const { isPending, isSuccess, mutate, data } = useGetDeletedReports();
  useEffect(() => {
    if (searchValue.trim().length < 1) {
      mutate({
        searchValue,
        page: 1,
      });
    }
  }, [searchValue]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchValue.trim().length > 1) {
        mutate({
          searchValue,
          page: 1,
        });
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchValue]);
  //success handles
  useEffect(() => {
    if (isSuccess) {
      setReportList(data.reportList);
      setTotalPages(data.totalPages);
    }
  }, [isSuccess]);

  //handle delete report
  const {
    isPending: isPendingDeleteReport,
    mutate: mutateDeleteReport,
    isSuccess: isSuccessDeleteReport,
    data: dataDeleteReport,
  } = useHardDeleteReport();
  const handleHardDeleteReport = (reportId: string) => {
    mutateDeleteReport(reportId);
  };
  useEffect(() => {
    if (isSuccessDeleteReport) {
      setReportList((prev) =>
        prev.filter((item) => item._id !== dataDeleteReport.reportId)
      );
    }
  }, [isSuccessDeleteReport]);

  useEffect(() => {
    const anyPending = isPendingDeleteReport;
    dispatch(anyPending ? showLoader() : hideLoader());
  }, [isPendingDeleteReport]);

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
