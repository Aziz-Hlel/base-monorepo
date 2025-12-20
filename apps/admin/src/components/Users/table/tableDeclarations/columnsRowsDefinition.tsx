import { type StatusEnum } from '@/Api/enums/StatusEnums';
import dayjs from '@/utils/dayjsConfig';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUp, ChevronsUpDown } from 'lucide-react';
import StatusComponent from '../EnumComponents/Status/StatusComponent';
import HeaderContainer from '../ContainerComp/HeaderContainer';
import RowContainer from '../ContainerComp/RowContainer';
import type { RoleType } from '../EnumComponents/Role/RolesComponent';
import RolesComponent from '../EnumComponents/Role/RolesComponent';
import type { TableRowType } from './typeNfieldsDeclaration';
import IsEmailVerifiedComponent from '../EnumComponents/IsEmailVerified/IsEmailVerifiedComponent';
import ActionComp from '../ActionComp';

type TableColumnDefinition<T> = ColumnDef<T> & { accessorKey?: keyof T };

const columnsRowsDefinition: TableColumnDefinition<TableRowType>[] = [
  {
    id: 'email',
    accessorFn: (row: TableRowType) => ({
      email: row.email,
      isEmailVerified: row.isEmailVerified,
    }),
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Email </span>
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className="rotate-180" />}
          {column.getIsSorted() === false && <ChevronsUpDown />}
        </HeaderContainer>
      );
    },
    cell: ({ getValue }) => {
      const { email, isEmailVerified } = getValue<{
        email: string;
        isEmailVerified: boolean;
      }>();
      return (
        <RowContainer className="lowercase w-full ">
          <IsEmailVerifiedComponent isEmailVerified={isEmailVerified} />
          &nbsp;
          {email}
        </RowContainer>
      );
    },

    enableSorting: true,
    enableHiding: true,
    enableGlobalFilter: true,
  },
  {
    accessorKey: 'username',
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Username</span>
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className="rotate-180" />}
          {column.getIsSorted() === false && <ChevronsUpDown />}
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
          <span>Status</span>
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className="rotate-180" />}
          {column.getIsSorted() === false && <ChevronsUpDown />}
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
          <span>Auth Provider</span>
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className="rotate-180" />}
          {column.getIsSorted() === false && <ChevronsUpDown />}
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
          <span>Role</span>
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className="rotate-180" />}
          {column.getIsSorted() === false && <ChevronsUpDown />}
        </HeaderContainer>
      );
    },
    cell: ({ row }) => (
      <RowContainer className="">
        <RolesComponent value={row.getValue('role') as RoleType} />
      </RowContainer>
    ),

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
          {column.getIsSorted() === false && <ChevronsUpDown />}
        </HeaderContainer>
      );
    },
    cell: ({ row }) => {
      const dateString = row.getValue('createdAt') as string;
      const formattedDate = dayjs(dateString).format('LL');
      return <RowContainer className=" w-full">{formattedDate}</RowContainer>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <RowContainer className="justify-end ps-0">
          <ActionComp row={row} />
        </RowContainer>
      );
    },
    size: 32,
    minSize: 32,
    maxSize: 32,
    enableSorting: false,
    enableHiding: false,
  },
];

export default columnsRowsDefinition;
