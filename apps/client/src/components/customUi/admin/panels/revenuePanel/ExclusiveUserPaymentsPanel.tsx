import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { ExclusiveUserPaymentsType } from '@bro/shared';
import ConfirmActionButton from '@client/components/customUi/commonElemets/ConfirmActionButton';
import { LuMenu } from 'react-icons/lu';
import DataTable from '@client/components/customUi/commonElemets/DataTable';
import ExclusiveDetailsModalContent from '../../elements/revenueElements/ExclusiveDetailsModalContent';
import { useExclusiveUserPaymentsPanelHook } from '@client/hooks/PageHooks/admin/revenue/useExclusiveUserPaymentsPanelHook';

function ExclusiveUserPaymentsPanel() {
  const {
    isPending,
    searchValue,
    setSearchValue,
    totalPages,
    transactionList,
    mutate,
    currentPage,
    setCurrentPage,
  } = useExclusiveUserPaymentsPanelHook();

  const columnHelper = createColumnHelper<ExclusiveUserPaymentsType>();
  const columns = [
    {
      header: '#',
      cell: (info: CellContext<ExclusiveUserPaymentsType, unknown>) => {
        return <span>{info.row.index + 1 + (currentPage - 1) * 10}</span>;
      },
    },
    columnHelper.accessor('exclusiveUser.name', { header: 'Exclusive User' }),
    columnHelper.accessor('totalCustomers', { header: 'Total Customers' }),
    columnHelper.accessor('totalAmount', { header: 'Total Amount' }),
    columnHelper.accessor('userShare', { header: 'User Share' }),
    columnHelper.accessor('adminShare', { header: 'User Share' }),
    {
      header: 'Actions',
      cell: (info: CellContext<ExclusiveUserPaymentsType, unknown>) => {
        const rowData = info.row.original;

        return (
          <div className="flex gap-4 justify-center items-center">
            <ConfirmActionButton
              buttonIcon={LuMenu}
              buttonClassName={`bg-blue-700 hover:bg-blue-800`}
              buttonContent="Details"
              modalTitle={`Full Details`}
              dialogClassName="sm:max-w-[900px]"
              isConfirmButtonDisabled={true}
              onConfirm={() => {}}
            >
              <ExclusiveDetailsModalContent transaction={rowData} />
            </ConfirmActionButton>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={transactionList}
      setSearchValue={setSearchValue}
      searchValue={searchValue}
      isPending={isPending}
      tableHeader="All Transactions"
      totalPages={totalPages}
      onPageChange={(page) => {
        setCurrentPage(page);
        mutate({ searchValue, page });
      }}
    ></DataTable>
  );
}

export default ExclusiveUserPaymentsPanel;
