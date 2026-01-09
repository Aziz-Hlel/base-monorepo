import dayjs from '@/utils/dayjsConfig';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUp, ChevronsUpDown } from 'lucide-react';
import StatusComponent, { type StatusType } from '../EnumColumns/Status/StatusComponent';
import HeaderContainer from '../ContainerComp/HeaderContainer';
import RowContainer from '../ContainerComp/RowContainer';
import type { RoleType } from '../EnumColumns/Role/RolesComponent';
import RolesComponent from '../EnumColumns/Role/RolesComponent';
import type { TableRowType } from './typesAndFieldsDeclaration';
import IsEmailVerifiedComponent from '../EnumColumns/IsEmailVerified/IsEmailVerifiedComponent';
import AuthProviderCell from '../EnumColumns/AuthProvider/AuthProviderCell';
import AuthProviderHeader from '../EnumColumns/AuthProvider/AuthProviderHeader';
import ActionsColumn from '../columns/ActionsColumn';

type TableColumnDefinition<T> = ColumnDef<T> & { accessorKey?: keyof T };

const columnsRowsDefinition: ColumnDef<TableRowType>[] = [
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
        <RowContainer className="lowercase w-96 ">
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
    cell: ({ row }) => (
      <RowContainer className=" w-96 truncate whitespace-nowrap ">{row.getValue('username')}</RowContainer>
    ),

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
        <StatusComponent value={row.getValue('status') as StatusType} />
      </RowContainer>
    ),

    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'provider',
    header: ({ column }) => <AuthProviderHeader column={column} />,
    cell: ({ getValue }) => <AuthProviderCell value={getValue<string>()} />,

    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'phoneNumber',
    accessorFn: (row: TableRowType) => row.profile?.phoneNumber ?? null,

    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Phone Number</span>
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className="rotate-180" />}
          {column.getIsSorted() === false && <ChevronsUpDown />}
        </HeaderContainer>
      );
    },
    cell: ({ getValue }) => <RowContainer className="">{getValue<string | null>()}</RowContainer>,

    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'address',
    accessorFn: (row: TableRowType) => row.profile?.address ?? null,

    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Address</span>
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className="rotate-180" />}
          {column.getIsSorted() === false && <ChevronsUpDown />}
        </HeaderContainer>
      );
    },
    cell: ({ getValue }) => <RowContainer className="">{getValue<string | null>()}</RowContainer>,

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
    cell: ({ row }) => <ActionsColumn row={row} />,
    size: 32,
    minSize: 32,
    maxSize: 32,
    enableSorting: false,
    enableHiding: false,
  },
];

export default columnsRowsDefinition;
