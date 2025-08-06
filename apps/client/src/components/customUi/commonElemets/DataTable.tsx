import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { Input } from '@client/components/ui/input';
import { Button } from '@client/components/ui/button';
import { Quantum } from 'ldrs/react';
import { ReactNode, useState, useMemo } from 'react';

type DataTableProps<T> = {
  columns: ColumnDef<T, any>[];
  data: T[];
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  isPending: boolean;
  children?: ReactNode;
  tableHeader: string;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function DataTable<T extends object>({
  columns,
  data,
  searchValue,
  setSearchValue,
  isPending,
  children,
  tableHeader,
  onPageChange,
  totalPages,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const handlePageChange = (p: number) => {
    setPage(p);
    onPageChange(p);
  };

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  const paginationItems = useMemo(() => {
    const items: (number | 'dots')[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      if (page <= 3) {
        items.push(1, 2, 3, 'dots', totalPages);
      } else if (page >= totalPages - 2) {
        items.push(1, 'dots', totalPages - 2, totalPages - 1, totalPages);
      } else {
        items.push(1, 'dots', page, 'dots', totalPages);
      }
    }

    return items;
  }, [page, totalPages]);

  return (
    <div className="overflow-x-auto min-h-screen w-full bg-[#F4F4F4] flex justify-center items-start py-10 px-5">
      <div className="w-full max-w-7xl bg-white rounded-[6px] shadow-[0px_4px_70px_#0000001a] overflow-hidden">
        {/* Header */}
        <div className="py-4 px-6 border-b border-gray-200 bg-white">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-lg">{tableHeader}</h4>
            <div>{children}</div>
          </div>
          <div className="mt-4">
            <Input
              placeholder="Search"
              className="w-full border-0 bg-[#F3F3F3] rounded-[6px] h-auto p-3 text-sm"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="px-6 py-4 overflow-y-auto">
          <div className="min-w-[800px] rounded-[6px] overflow-hidden border">
            <table className="table-auto w-full text-sm text-center">
              <thead className="bg-[#F5F5F5] border-b border-gray-100 h-[50px]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="p-3 font-medium text-[#666666]"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`text-[13px] h-[60px] ${
                      index % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-white'
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-3 whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              {!isPending && ((data && data.length === 0) || !data) && (
                <tfoot>
                  <tr>
                    <td colSpan={100} className="text-center py-4">
                      No data available
                    </td>
                  </tr>
                </tfoot>
              )}
              {isPending && (
                <tfoot>
                  <tr>
                    <td colSpan={100} className="text-center py-4">
                      <Quantum size={40} speed={1.75} color="black" />
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 gap-2">
              <Button
                variant="ghost"
                size="icon"
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                ←
              </Button>

              {paginationItems.map((item, index) =>
                item === 'dots' ? (
                  <span key={index} className="px-2 text-gray-400">
                    ...
                  </span>
                ) : (
                  <Button
                    key={index}
                    variant={page === item ? 'default' : 'ghost'}
                    size="icon"
                    className={page === item ? 'bg-black text-white' : ''}
                    onClick={() => handlePageChange(item)}
                  >
                    {item}
                  </Button>
                )
              )}

              <Button
                variant="ghost"
                size="icon"
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                →
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DataTable;
