import type { UserProfileRowResponse } from '@contracts/schemas/user/UserRowResponse';
import type { Prettify } from '@contracts/utils/Prettify';

export type TableRowType = UserProfileRowResponse;
export type NestedObject = Prettify<NonNullable<TableRowType['profile']>>;
export type TableRowKeys = keyof TableRowType | keyof NestedObject;

export const columnFiltersKeys: Set<TableRowKeys> = new Set(['status', 'role'] as const);

export const sortableColumnKeys: TableRowKeys[] = [
  'email',
  'username',
  'status',
  'authId',
  'role',
  'createdAt',
  'phoneNumber',
  'address',
  'provider',
] as const;
