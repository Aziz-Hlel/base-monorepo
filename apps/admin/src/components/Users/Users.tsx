import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { Table, TableBody } from '../ui/table';
import columnsRowsDefinition from './table/tableDeclarations/columnsRowsDefinition';
import useGetTableData from './table/use-get-table-data';
import useTableProps from './table/use-table-props';
import { useMemo } from 'react';
import TableHeaders from './table/tableComposites/TableHeaders';
import TableDataRows from './table/tableComposites/TableDataRows';
import { DataTableToolbar } from './table/toolBar/DataTableToolbar';
import type { ColumnFilter } from './table/Filters/ColumnFilters';
import tableFilters from './table/Filters/ColumnFilters';
import { DataTablePagination } from './table/pagination/Pagination';
import { EmptyRows, LoadingInRowsComp, NoResultComp } from './table/tableDeclarations/FillerRows';
import { type TableRowType, } from './table/tableDeclarations/typeNfieldsDeclaration';


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
    globalSearch,
    setGlobalSearch
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
    onGlobalFilterChange: setGlobalSearch,

    manualPagination: true,
    pageCount: pagination.totalPages,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: globalSearch,
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
        <DataTableToolbar table={table} filters={userTableFilters} />
        <div className=" rounded-md border ">
          <Table className=" max-w-full w-full ">
            <TableHeaders<TableRowType> table={table} />
            <TableBody>
              {!isLoading && isTableNotEmpty && <TableDataRows<TableRowType> table={table} />}
              {!isLoading &&
                isTableHalfwayPopulated
                && (<EmptyRows<TableRowType> emptyRows={nbrEmptyRows} table={table} />)}
              {isLoading && <LoadingInRowsComp<TableRowType> pageSize={tanStackpagination.pageSize} table={table} />}
              {!isLoading && isTableEmpty && <NoResultComp<TableRowType> table={table} emptyRows={pageSize} />}
            </TableBody>
          </Table>
        </div>
        <div className=" ">
          <DataTablePagination table={table} className='mt-auto' />
        </div>
      </div>
    </>
  );
};

export default UsersTable;
