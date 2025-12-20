import { Table, TableBody } from '../ui/table';
import TableHeaders from './table/tableComposites/TableHeaders';
import { DataTableToolbar } from './table/toolBar/DataTableToolbar';
import type { ColumnFilter } from './table/toolBar/Filters/ColumnFilters';
import tableFilters from './table/toolBar/Filters/ColumnFilters';
import { DataTablePagination } from './table/pagination/Pagination';
import { type TableRowType } from './table/tableDeclarations/typeNfieldsDeclaration';
import useMyTable from './use-my-table';
import TableBodyContent from './table/TableMainComp/TableBodyContent';
import { SelectedRowProvider } from './table/context/selected-row-provider';
import DialogContainer from './dialogs/DialogContainer';

const UsersTable = () => {
  const { table, pageSize, isLoading } = useMyTable();

  const userTableFilters: ColumnFilter<any>[] = tableFilters;

  return (
    <>
      <SelectedRowProvider>
        <div className="w-full max-w-full flex flex-col gap-4  ">
          <DataTableToolbar table={table} filters={userTableFilters} />
          <div className=" rounded-md border  overflow-hidden">
            <Table className="table-fixed ">
              <TableHeaders<TableRowType> table={table} />
              <TableBody>
                <TableBodyContent table={table} isLoading={isLoading} pageSize={pageSize} />
              </TableBody>
            </Table>
          </div>
          <div>
            <DataTablePagination table={table} className="mt-auto" />
          </div>
          <DialogContainer />
        </div>
      </SelectedRowProvider>
    </>
  );
};

export default UsersTable;
