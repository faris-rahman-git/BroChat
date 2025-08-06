import { usegetAllTransactions } from '@client/hooks/admin/revenueManagement/useGetSubscriptionDetails';
import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { AllTransactionsOutType } from '@bro/shared';
import ConfirmActionButton from '@client/components/customUi/commonElemets/ConfirmActionButton';
import { LuMenu, LuSearch } from 'react-icons/lu';
import DataTable from '@client/components/customUi/commonElemets/DataTable';
import { format } from 'date-fns';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@client/components/ui/select';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { Button } from '@client/components/ui/button';
import { Calendar } from '@client/components/ui/calendar';
import ButtonIcon from '@client/components/customUi/commonElemets/ButtonIcon';
import { MdClear } from 'react-icons/md';
import TransactionDetailsModalContent from '../../elements/revenueElements/TransactionDetailsModalContent';

function AllTransactionsPanel() {
  const [transactionList, setTransactionList] = useState<
    AllTransactionsOutType[]
  >([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    type: '',
    createdAt: '',
  });

  const { isPending, isSuccess, isError, mutate, error, data } =
    usegetAllTransactions();

  useEffect(() => {
    if (searchValue.trim().length < 1) {
      mutate({
        searchValue,
        ...filters,
        page: 1,
      });
    }
  }, [searchValue]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchValue.trim().length > 1) {
        mutate({
          searchValue,
          ...filters,
          page: 1,
        });
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchValue]);

  //success handles
  useEffect(() => {
    if (isSuccess) {
      setTransactionList(data.transactions);
      setTotalPages(data.totalPages);
    }
  }, [isSuccess]);

  //error handles
  useEffect(() => {
    if (isError) {
      console.log(error.message);
    }
  }, [isError]);

  const columnHelper = createColumnHelper<AllTransactionsOutType>();
  const columns = [
    {
      header: '#',
      cell: (info: CellContext<AllTransactionsOutType, unknown>) => {
        return <span>{info.row.index + 1 + (currentPage - 1) * 10}</span>;
      },
    },
    columnHelper.accessor('recipientName', { header: 'Recipient Name' }),
    columnHelper.accessor('recipientEmail', { header: 'Email' }),
    columnHelper.accessor('paymentId', { header: 'PaymentId' }),
    columnHelper.accessor('feature', { header: 'Type' }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      cell: (info: CellContext<AllTransactionsOutType, unknown>) => {
        const date = new Date(info.getValue() as string);
        const formatted = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
        return <span>{formatted}</span>; // e.g., 17 Jun 2025
      },
    }),
    {
      header: 'Actions',
      cell: (info: CellContext<AllTransactionsOutType, unknown>) => {
        const rowData = info.row.original;

        return (
          <div className="flex gap-4 justify-center items-center">
            <ConfirmActionButton
              buttonIcon={LuMenu}
              buttonClassName={`bg-blue-700 hover:bg-blue-800`}
              buttonContent="Details"
              modalTitle={`User Details`}
              dialogClassName="sm:max-w-[700px]"
              isConfirmButtonDisabled={true}
              onConfirm={() => {}}
            >
              <TransactionDetailsModalContent transaction={rowData} />
            </ConfirmActionButton>
          </div>
        );
      },
    },
  ];

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    setFilters((prev) => ({
      ...prev,
      createdAt: selectedDate.toLocaleDateString('en-CA'),
    }));
  };

  const handleSearchWithFilters = () => {
    mutate({
      searchValue,
      ...filters,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      type: '', // ✅ Corrected key
      createdAt: '', // ✅ Corrected key
    };
    setFilters(clearedFilters);
    mutate({
      searchValue,
      ...clearedFilters,
      page: 1,
    });
  };

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
        mutate({ searchValue, ...filters, page });
      }}
    >
      <div className="flex gap-2">
        <div className="text-sm font-medium text-center flex items-center">
          <span>Filter By:</span>
        </div>
        <Select
          value={filters.type}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, type: value }))
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
            <SelectItem value="premium_group">Paid Group</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[150px] justify-start text-left font-normal"
            >
              {filters.createdAt ? (
                format(new Date(filters.createdAt), 'dd MMM yyyy')
              ) : (
                <span className="text-muted-foreground">Created At</span>
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
              disabled={(date: Date) => date > new Date()}
            />
          </PopoverContent>
        </Popover>
        <ButtonIcon
          Icon={LuSearch}
          label={'Search'}
          className={`text-white  flex justify-center items-center bg-blue-800 hover:bg-blue-900 hover:text-white px-4 py-[6px]`}
          onClick={handleSearchWithFilters}
        ></ButtonIcon>
        <ButtonIcon
          Icon={MdClear}
          label={'Search'}
          className={`text-white flex justify-center items-center bg-red-600 hover:bg-red-700 hover:text-white px-4 py-[6px]`}
          onClick={handleClearFilters}
        ></ButtonIcon>
      </div>
    </DataTable>
  );
}

export default AllTransactionsPanel;
