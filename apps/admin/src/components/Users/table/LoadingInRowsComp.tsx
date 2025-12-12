import { Spinner } from '@/components/ui/spinner';
import { TableCell, TableRow } from '@/components/ui/table';
import type { Table } from '@tanstack/react-table';

interface LoadingInRowsCompProps<T> {
  table: Table<T>;
  emptyRows: number;
}
const LoadingInRowsComp = <T,>({ table, emptyRows }: LoadingInRowsCompProps<T>) => {
  return (
    <>
      <TableRow className="pointer-events-none ">
        <TableCell className=" " colSpan={table.getAllLeafColumns().length}>
          <div className=" w-full flex justify-center items-center space-x-2 text-black opacity-100 ">
            <Spinner /> <span>Loading...</span>
          </div>
        </TableCell>
      </TableRow>
      {emptyRows > 1 &&
        [...Array(emptyRows - 1)].map((_, i) => (
          <TableRow key={`empty-${i}`} className="pointer-events-none opacity-50">
            {table.getAllLeafColumns().map((col) => (
              <TableCell key={col.id}>&nbsp;</TableCell>
            ))}
          </TableRow>
        ))}
    </>
  );
};

export default LoadingInRowsComp;
