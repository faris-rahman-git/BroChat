import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { ReportSubResponse } from '@bro/shared';
import DataTable from '@client/components/customUi/commonElemets/DataTable';
import ConfirmActionButton from '@client/components/customUi/commonElemets/ConfirmActionButton';
import { LuBan, LuEyeOff, LuMenu, LuTrash2 } from 'react-icons/lu';
import CustomModals from '@client/components/customUi/commonElemets/CustomModals';
import ReportDetailsModalContent from '../../elements/reportElements/ReportDetailsModalContent';
import { Textarea } from '@client/components/ui/textarea';
import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { Button } from '@client/components/ui/button';
import { Calendar } from '@client/components/ui/calendar';
import { format } from 'date-fns';
import { useReportDetailsPanelHook } from '@client/hooks/PageHooks/admin/report/useReportDetailsPanelHook';

function ReportDetailsPanel() {
  const {
    filters,
    handleBlockUser,
    handleDeleteReport,
    handleIgnoreReport,
    inpRef,
    isPending,
    reportList,
    searchValue,
    setFilters,
    setSearchValue,
    totalPages,
    mutate,
    handleDateSelect,
    selectedReport,
    setSelectedReport,
    selectedButton,
    setSelectedButton,
    openModal,
    setOpenModal,
  } = useReportDetailsPanelHook();

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
            <ButtonIcon
              Icon={LuBan}
              label={'block'}
              onClick={() => {
                setSelectedReport(rowData);
                setSelectedButton('block');
                setOpenModal(true);
              }}
              className="justify-start ps-[9px] bg-[#FF5C5C] hover:bg-[#FF4848]"
              iconClassName="text-white"
            />
            <ButtonIcon
              Icon={LuEyeOff}
              label={'ignoreReport'}
              onClick={() => {
                setSelectedReport(rowData);
                setSelectedButton('ignoreReport');
                setOpenModal(true);
              }}
              className="justify-start ps-[9px] bg-green-700 hover:bg-green-800"
              iconClassName="text-white"
            />
            <ButtonIcon
              Icon={LuTrash2}
              label={'deleteReport'}
              onClick={() => {
                setSelectedReport(rowData);
                setSelectedButton('deleteReport');
                setOpenModal(true);
              }}
              className="justify-start ps-[9px] bg-[#600e0e] hover:bg-[#512e2e]"
              iconClassName="text-white"
            />

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
              <ReportDetailsModalContent report={rowData} />
            </ConfirmActionButton>

            {selectedReport && (
              <CustomModals
                open={openModal}
                onOpenChange={(val) => {
                  if (!val) setSelectedReport(null);
                  setOpenModal(val);
                }}
                onConfirm={
                  selectedButton === 'block'
                    ? () =>
                        handleBlockUser(
                          selectedReport._id,
                          selectedReport.reportedUserId._id
                        )
                    : selectedButton === 'deleteReport'
                    ? () => handleDeleteReport(selectedReport._id)
                    : () => handleIgnoreReport(selectedReport._id)
                }
                title={
                  selectedButton === 'block'
                    ? 'Block User'
                    : selectedButton === 'deleteReport'
                    ? 'Delete Report'
                    : 'Ignore Report'
                }
                description={
                  selectedButton === 'block'
                    ? 'Confirm that you want to block this user. This action can be undone.'
                    : selectedButton === 'deleteReport'
                    ? 'Confirm that you want to delete this report. This action can be undone.'
                    : 'Confirm that you want to ignore this report. This action can be undone.'
                }
                confirmText="Confirm"
              >
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold">Note:</span>
                  <Textarea
                    className="text-xs border rounded px-2 py-1 focus-visible:border-[#615EF0] focus-visible:ring-0"
                    rows={2}
                    ref={inpRef}
                  />
                </div>
              </CustomModals>
            )}
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
      tableHeader="Pending Reports"
      totalPages={totalPages}
      onPageChange={(page) =>
        mutate({
          searchValue,
          ...filters,
          page,
        })
      }
    >
      <div className="flex gap-2 mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[150px] justify-start text-left font-normal"
            >
              {filters.createdAt ? (
                format(new Date(filters.createdAt), 'dd MMM yyyy')
              ) : (
                <span className="text-muted-foreground">Reported At</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={
                filters.createdAt ? new Date(filters.createdAt) : undefined
              }
              onSelect={handleDateSelect}
              disabled={(date) => date > new Date()}
            />
          </PopoverContent>
        </Popover>

        <ButtonIcon
          Icon={LuTrash2}
          label="Clear"
          className="text-white bg-red-600 hover:bg-red-700 px-4 py-[6px]"
          onClick={() => {
            const cleared = { createdAt: '' };
            setFilters(cleared);
            mutate({
              searchValue,
              ...cleared,
              page: 1,
            });
          }}
        />
      </div>
    </DataTable>
  );
}

export default ReportDetailsPanel;
