import StatusTextMapping from '@/EnumTextMapping/StatusTextMapping';
import { UserRound, CircleUser, ShieldUser, UserStar } from 'lucide-react';
import type { TableRowType } from '../../tableDeclarations/typesAndFieldsDeclaration';

export type ColumnFilter<T extends keyof TableRowType> = {
  columnId: T;
  title: string;
  options: {
    label: string;
    value: TableRowType[T];
    icon?: React.ComponentType<{ className?: string }>;
  }[];
};

const statusFilterData: ColumnFilter<'status'> = {
  columnId: 'status',
  title: 'Status',
  options: Object.keys(StatusTextMapping).map((key) => ({
    label: StatusTextMapping[key as keyof typeof StatusTextMapping],
    value: key as keyof typeof StatusTextMapping,
  })),
};

const roleFilterData: ColumnFilter<'role'> = {
  columnId: 'role',
  title: 'Role',
  options: [
    { label: 'Admin', value: 'ADMIN', icon: UserStar },
    { label: 'User', value: 'USER', icon: UserRound },
    { label: 'Staff', value: 'STAFF', icon: CircleUser },
    { label: 'Super Admin', value: 'SUPER_ADMIN', icon: ShieldUser },
    // { label: 'Moderator', value: 'MODERATOR' },
  ],
};

const tableFilters = [statusFilterData, roleFilterData];

export default tableFilters;
