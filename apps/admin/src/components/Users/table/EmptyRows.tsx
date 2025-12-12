import { TableCell, TableRow } from '@/components/ui/table';
import type { Table } from '@tanstack/react-table';

interface EmptyRowsProps<T> {
  emptyRows: number;
  table: Table<T>;
}

const EmptyRows = <T,>({ emptyRows, table }: EmptyRowsProps<T>) => {
  return (
    <>
      {emptyRows > 1 &&
        [...Array(emptyRows - 1)].map((_, i) => (
          <TableRow key={`empty-${i}`} className="pointer-events-none opacity-50">
            {table.getAllLeafColumns().map((col) => (
              <TableCell key={col.id} colSpan={table.getAllLeafColumns().length} className=" h-full">
                &nbsp;
              </TableCell>
            ))}
          </TableRow>
        ))}
    </>
  );
};

export default EmptyRows;
