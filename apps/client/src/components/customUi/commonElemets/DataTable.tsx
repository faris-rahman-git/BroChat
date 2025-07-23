import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { Input } from '@client/components/ui/input';
import { Quantum } from 'ldrs/react';
import { ReactNode } from 'react';

type DataTableProps<T> = {
  columns: ColumnDef<T, any>[];
  data: T[];
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  isPending: boolean;
  children?: ReactNode;
  tableHeader: string;
};

function DataTable<T extends object>({
  columns,
  data,
  searchValue,
  setSearchValue,
  isPending,
  children,
  tableHeader,
}: DataTableProps<T>) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto min-h-screen w-full bg-[#F4F4F4] flex justify-center items-start py-10 px-5">
      <div className="w-full max-w-7xl bg-white rounded-[6px] shadow-[0px_4px_70px_#0000001a] overflow-hidden">
        {/* Header Section */}
        <div className="py-4 px-6 border-b border-gray-200 bg-white">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-lg">{tableHeader}</h4>
            <div>{children}</div>
          </div>
          <div className="mt-4">
            <Input
              placeholder="Search UserName or Email"
              className="w-full border-0 bg-[#F3F3F3] rounded-[6px] h-auto p-3 shadow-none focus-visible:ring-0 placeholder:opacity-40 placeholder:text-black text-sm"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="px-6 py-4 overflow-y-auto">
          <div className="min-w-[800px] rounded-[6px] overflow-hidden border">
            <table className="table-auto w-full text-sm text-center border-collapse overflow-auto">
              <thead className="bg-[#F5F5F5] border-b border-gray-100 h-[50px]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="p-3 font-medium text-[#666666] whitespace-nowrap"
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
              {!isPending && data.length === 0 && (
                <tfoot>
                  <tr>
                    <td colSpan={100} className="text-center py-4">
                      <span>No data available in table</span>
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
        </div>
        
      </div>
    </div>
  );
}

export default DataTable;
