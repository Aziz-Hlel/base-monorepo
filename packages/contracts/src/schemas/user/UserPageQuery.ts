import z, { keyof } from 'zod';
import { Role, Status } from '../../types/enums/enums';
import { UserProfileRowResponse } from './UserRowResponse';
import { Prettify } from '../../utils/Prettify';

export type TableRowType = UserProfileRowResponse;
export type NestedObject = Prettify<NonNullable<TableRowType['profile']>>;
export type RootKeys = keyof TableRowType;
export type ProfileKeys = keyof NestedObject;
export type TableRowKeys = RootKeys | ProfileKeys;

export const columnFiltersKeys: Set<TableRowKeys> = new Set(['status', 'role'] as const);

export const rootLevelSortableFields: RootKeys[] = [
  'email',
  'username',
  'status',
  'authId',
  'role',
  'provider',
  'createdAt',
] as const;

export const profileLevelSortableFields: ProfileKeys[] = ['phoneNumber', 'address'] as const;

export const sortableColumnKeys: TableRowKeys[] = rootLevelSortableFields.concat(profileLevelSortableFields as any);

const csvEnumArray = <T extends string[]>(values: T) =>
  z
    .string()
    .transform((value) =>
      value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
        .sort(),
    )
    .pipe(z.array(z.enum(values)));

export const queryParamsSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  size: z.coerce.number().int().min(5).max(50).catch(10),
  sort: z.enum(sortableColumnKeys).catch('createdAt'),
  order: z.enum(['asc', 'desc']).catch('desc'),
  search: z.string().trim().catch(''),
  // Filters
  role: csvEnumArray(Object.values(Role)).catch([]),
  status: csvEnumArray(Object.values(Status)).catch([]),
});
export type TableQueryParams = z.infer<typeof queryParamsSchema>;
export type UsersRequiredTableQueryParams = TableQueryParams;

export const usersDefaultQuery: UsersRequiredTableQueryParams = {
  page: 1,
  size: 10,
  sort: 'createdAt',
  order: 'desc',
  search: '',
  role: [],
  status: [],
};

export type UserPageQuery = z.infer<typeof queryParamsSchema>;
