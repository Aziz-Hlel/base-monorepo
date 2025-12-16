import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { Table, TableBody } from '../ui/table';
import columnsRowsDefinition from './table/tableDefinition/columnsRowsDefinition';
import useGetTableData from './table/use-get-table-data';
import useTableProps from './table/use-table-props';
import type { UserRowResponse } from '@/types/user/UserRow';
import { useMemo } from 'react';
import TableHeaders from './table/TableHeaders';
import TableDataRows from './table/TableDataRows';
import { DataTableToolbar } from './table/toolBar/DataTableToolbar';
import type { ColumnFilter } from './table/Filters/ColumnFilters';
import tableFilters from './table/Filters/ColumnFilters';
import { DataTablePagination } from './table/pagination/Pagination';
import { EmptyRows, LoadingInRowsComp, NoResultComp } from './table/tableDefinition/FillerRows';

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
    pageIndex,
    pagination: tanStackpagination,
    changePage,
    onPaginationChange,
    onPageSizeChange,
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
  const firstElementIndex = pagination.offset + 1;
  const lastElementIndex = firstElementIndex + table.getRowModel().rows.length - 1;

  const nbrEmptyRows = pageSize - table.getRowModel().rows.length;

  return (
    <>
      <div className="w-full max-w-full flex flex-col gap-4  ">
        <DataTableToolbar table={table} searchKey={searchKey} filters={userTableFilters} />
        <div className="overflow-hidden rounded-md border w-fit mx-auto">
          <Table
            className=" max-w-full "
            style={{
              // this is needed for column resizing
              width: table.getCenterTotalSize(),
            }}
          >
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
        <div className="flex items-center justify-end space-x-2 py-4">
          <DataTablePagination table={table} />
        </div>
      </div>
    </>
  );
};

export default UsersTable;
