import { TableCell, TableRow } from '@/components/ui/table';
import type { Table } from '@tanstack/react-table';

interface NoResultCompProps<T> {
  table: Table<T>;
  emptyRows: number;
}
const NoResultComp = <T,>({ table, emptyRows }: NoResultCompProps<T>) => {
  return (
    <>
      <TableRow className="pointer-events-none opacity-50">
        <TableCell className=" text-center text-black" colSpan={table.getAllLeafColumns().length}>
          No Results
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

export default NoResultComp;
