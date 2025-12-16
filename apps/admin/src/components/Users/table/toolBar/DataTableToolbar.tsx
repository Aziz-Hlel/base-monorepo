import type { Table } from '@tanstack/react-table';
import { DataTableViewOptions } from './view-options';
import type { TableRowType } from '../../Users';
import SearchInput from './SearchInput';
import EnumFilterToolBar from './EnumFilterToolBar';

type DataTableToolbarProps = {
  table: Table<TableRowType>;
  searchKey: keyof TableRowType;
  filters?: {
    columnId: keyof TableRowType;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
};

export function DataTableToolbar({ table, searchKey, filters = [] }: DataTableToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <SearchInput table={table} searchKey={searchKey} />
        <EnumFilterToolBar table={table} filters={filters} />
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
