import type { UserRowResponse } from '@/types/user/UserRowResponse';

export type TableRowType = UserRowResponse;
export type TableRowKeys = keyof TableRowType;

export const columnFiltersKeys: Set<TableRowKeys> = new Set(['status', 'role'] as const);

export const sortableColumnKeys: TableRowKeys[] = [
  'email',
  'username',
  'status',
  'authId',
  'role',
  'createdAt',
] as const;
