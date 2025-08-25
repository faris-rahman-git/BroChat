import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

export const useDataTableHook = <T extends object>(
  onPageChange: (page: number) => void,
  totalPages: number,
  columns: ColumnDef<T, any>[],
  data: T[]
) => {
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

  return {
    table,
    page,
    handlePageChange,
    paginationItems,
  };
};
