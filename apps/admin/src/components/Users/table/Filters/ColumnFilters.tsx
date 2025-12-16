import StatusEnums, { type StatusEnum } from '@/Api/enums/StatusEnums';
import StatusTextMapping from '@/EnumTextMapping/StatusTextMapping';
import type { TableRowType } from '../../Users';

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
    { label: 'Admin', value: 'ADMIN' },
    { label: 'User', value: 'USER' },
    // { label: 'Moderator', value: 'MODERATOR' },
  ],
};

const tableFilters = [statusFilterData, roleFilterData];

export default tableFilters;
