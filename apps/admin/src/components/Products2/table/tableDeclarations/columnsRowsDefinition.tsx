import dayjs from '@/utils/dayjsConfig';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUp, ChevronsUpDown } from 'lucide-react';
import StatusComponent, { type StatusType } from '../EnumColumns/Status/StatusComponent';
import HeaderContainer from '../ContainerComp/HeaderContainer';
import RowContainer from '../ContainerComp/RowContainer';
import type { TableRowType } from './typesAndFieldsDeclaration';
import ActionsColumn from '../columns/ActionsColumn';

type ColumnDefCustom<T> = ColumnDef<T> & { accessorKey?: keyof T };

const columnsRowsDefinition: ColumnDefCustom<TableRowType>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    accessorFn: (row: TableRowType) => ({
      name: row.name,
    }),
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Name </span>
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className="rotate-180" />}
          {column.getIsSorted() === false && <ChevronsUpDown />}
        </HeaderContainer>
      );
    },
    cell: ({ getValue }) => {
      const { name } = getValue<{
        name: string;
      }>();
      return <RowContainer className="lowercase w-96 ">{name}</RowContainer>;
    },

    enableSorting: true,
    enableHiding: true,
    enableGlobalFilter: true,
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Description</span>
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className="rotate-180" />}
          {column.getIsSorted() === false && <ChevronsUpDown />}
        </HeaderContainer>
      );
    },
    cell: ({ getValue }) => {
      const description = getValue<string>();
      return <RowContainer className=" w-96 truncate whitespace-nowrap ">{description}</RowContainer>;
    },

    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Status</span>
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className="rotate-180" />}
          {column.getIsSorted() === false && <ChevronsUpDown />}
        </HeaderContainer>
      );
    },
    cell: ({ getValue }) => {
      const status = getValue<StatusType>();
      return (
        <RowContainer className="">
          <StatusComponent value={status} />
        </RowContainer>
      );
    },

    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'price',
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Price</span>
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className="rotate-180" />}
          {column.getIsSorted() === false && <ChevronsUpDown />}
        </HeaderContainer>
      );
    },
    cell: ({ getValue }) => {
      const price = getValue<string>();
      return <RowContainer className=" w-96 truncate whitespace-nowrap ">{price}</RowContainer>;
    },

    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Created At</span>
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className="rotate-180" />}
          {column.getIsSorted() === false && <ChevronsUpDown />}
        </HeaderContainer>
      );
    },
    cell: ({ getValue }) => {
      const dateString = getValue<string>();
      const formattedDate = dayjs(dateString).format('LL');
      return <RowContainer className=" w-full">{formattedDate}</RowContainer>;
    },

    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsColumn row={row} />,
    size: 32,
    minSize: 32,
    maxSize: 32,
    enableSorting: false,
    enableHiding: false,
  },
];

export default columnsRowsDefinition;
