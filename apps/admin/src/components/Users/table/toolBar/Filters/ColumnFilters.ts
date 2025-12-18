import StatusEnums, { type StatusEnum } from '@/Api/enums/StatusEnums';
import StatusTextMapping from '@/EnumTextMapping/StatusTextMapping';
import { UserRound, CircleUser, ShieldUser, UserStar } from 'lucide-react';
import type { TableRowType } from '../../tableDeclarations/typeNfieldsDeclaration';

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
  options: Object.keys(StatusEnums).map((key) => ({
    label: StatusTextMapping[key as keyof typeof StatusEnums],
    value: key as StatusEnum,
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
