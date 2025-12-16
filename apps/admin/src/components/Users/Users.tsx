import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { Table, TableBody } from '../ui/table';
import columnsRowsDefinition from './table/tableDefinition/columnsRowsDefinition';
import useGetTableData from './table/use-get-table-data';
import useTableProps from './table/use-table-props';
import { useMemo } from 'react';
import TableHeaders from './table/TableHeaders';
import TableDataRows from './table/TableDataRows';
import { DataTableToolbar } from './table/toolBar/DataTableToolbar';
import type { ColumnFilter } from './table/Filters/ColumnFilters';
import tableFilters from './table/Filters/ColumnFilters';
import { DataTablePagination } from './table/pagination/Pagination';
import { EmptyRows, LoadingInRowsComp, NoResultComp } from './table/tableDefinition/FillerRows';
import type { UserRowResponse } from '@/types/user/UserRowResponse';

export type TableRowType = UserRowResponse;

export const searchKey: keyof TableRowType = 'email';
export const columnFiltersKeys: (keyof TableRowType)[] = ['status', 'role'] as const;
export const allowedFilterIds: Set<string> = new Set([...columnFiltersKeys, searchKey]);

const UsersTable = () => {
  const { tableData, pagination, isLoading } = useGetTableData();

  const tableColumns = useMemo(() => columnsRowsDefinition, []);

  const userTableFilters: ColumnFilter<any>[] = tableFilters;

  const {
    sorting,
    onSortingChange,
    columnFilters,
    onColumnFiltersChange,
    pageSize,
    pagination: tanStackpagination,
    onPaginationChange,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
  } = useTableProps();

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    columnResizeMode: 'onChange', // helps with adjusting column size

    onSortingChange: onSortingChange,
    onColumnFiltersChange: onColumnFiltersChange,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: onPaginationChange,
    manualPagination: true,
    pageCount: pagination.totalPages,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: tanStackpagination,

    },
  });

  const isTableNotEmpty = table.getRowModel().rows?.length !== 0;
  const isTableEmpty = !isTableNotEmpty;
  const isTableHalfwayPopulated = isTableNotEmpty && table.getRowModel().rows?.length !== pageSize;
  const nbrEmptyRows = pageSize - table.getRowModel().rows.length;


  return (
    <>
      <div className="w-full max-w-full flex flex-col gap-4  ">
        <DataTableToolbar table={table} searchKey={searchKey} filters={userTableFilters} />
        <div className=" rounded-md border ">
          <Table className=" max-w-full w-full ">
            <TableHeaders<TableRowType> table={table} />
            <TableBody>
              {isTableNotEmpty && <TableDataRows<TableRowType> table={table} />}
              {isLoading && <LoadingInRowsComp<TableRowType> emptyRows={nbrEmptyRows} table={table} />}
              {!isLoading && isTableHalfwayPopulated && (
                <EmptyRows<TableRowType> emptyRows={nbrEmptyRows} table={table} />
              )}
              {!isLoading && isTableEmpty && <NoResultComp<TableRowType> table={table} emptyRows={pageSize} />}
            </TableBody>
          </Table>
        </div>
        <div className=" ">
          <DataTablePagination table={table} className='mt-auto'  />
        </div>
      </div>
    </>
  );
};

export default UsersTable;
