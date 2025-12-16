import { type StatusEnum } from '@/Api/enums/StatusEnums';
import dayjs from '@/utils/dayjsConfig';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUp, ArrowUpDown } from 'lucide-react';
import type { TableRowType } from '../../Users';
import StatusComponent from '../EnumComponents/Status/StatusComponent';
import HeaderContainer from '../ContainerComp/HeaderContainer';
import RowContainer from '../ContainerComp/RowContainer';

type TableColumnDefinition<T> = ColumnDef<T, unknown> & { accessorKey: keyof T };



const columnsRowsDefinition: TableColumnDefinition<TableRowType>[] = [
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Email
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className="rotate-180" />}
          {column.getIsSorted() === false && <ArrowUpDown />}
        </HeaderContainer>
      );
    },
    cell: ({ row }) => <RowContainer className="lowercase ">{row.getValue('email')}</RowContainer>,

    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'username',
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Username
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className="rotate-180" />}
          {column.getIsSorted() === false && <ArrowUpDown />}
        </HeaderContainer>
      );
    },
    cell: ({ row }) => <RowContainer className="">{row.getValue('username')}</RowContainer>,

    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Status
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className="rotate-180" />}
          {column.getIsSorted() === false && <ArrowUpDown />}
        </HeaderContainer>
      );
    },
    cell: ({ row }) => (
      <RowContainer className="">
        <StatusComponent value={row.getValue('status') as StatusEnum} />
      </RowContainer>
    ),

    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'provider',
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Auth Provider
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className="rotate-180" />}
          {column.getIsSorted() === false && <ArrowUpDown />}
        </HeaderContainer>
      );
    },
    cell: ({ row }) => <RowContainer className="">{row.getValue('provider')}</RowContainer>,

    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Role
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className="rotate-180" />}
          {column.getIsSorted() === false && <ArrowUpDown />}
        </HeaderContainer>
      );
    },
    cell: ({ row }) => <RowContainer className="">{row.getValue('role')}</RowContainer>,

    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Created At
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className="rotate-180" />}
          {column.getIsSorted() === false && <ArrowUpDown />}
        </HeaderContainer>
      );
    },
    cell: ({ row }) => {
      const dateString = row.getValue('createdAt') as string;
      const formattedDate = dayjs(dateString).format('LL');
      return <RowContainer className="  w-full">{formattedDate}</RowContainer>;
    },
    enableSorting: true,
    enableHiding: true,
  },
];

export default columnsRowsDefinition;
