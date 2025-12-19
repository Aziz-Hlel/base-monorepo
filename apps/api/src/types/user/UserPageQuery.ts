import z from 'zod';
import { createSeachParamsSchemaWithSortFields } from '../api/DefaultSeachParamsWithSortFields';
import { Role, Status } from '../enums/enums';
import { UserRowResponse } from '@contracts/types/user/UserRowResponse';

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

export const UserPageQuerySortFields = ['createdAt', 'id', 'email', 'role', 'username'];

const csvEnumArray = <T extends string[]>(values: T) =>
  z
    .string()
    .transform((value) =>
      value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.enum(values)));

const queryParamsSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  size: z.coerce.number().int().min(5).max(50).catch(10),
  sort: z.enum(sortableColumnKeys).catch('createdAt'),
  order: z.enum(['asc', 'desc']).catch('desc'),
  search: z.string().catch(''),
  // Filters
  role: csvEnumArray(Object.values(Role)).catch([]),
  status: csvEnumArray(Object.values(Status)).catch([]),
});
export type TableQueryParams = z.infer<typeof queryParamsSchema>;
export type RequiredTableQueryParams = TableQueryParams;

export const defaultQuery: RequiredTableQueryParams = {
  page: 1,
  size: 10,
  sort: 'createdAt',
  order: 'desc',
  search: '',
  role: [],
  status: [],
};

const userPageQuerySchema = createSeachParamsSchemaWithSortFields(UserPageQuerySortFields);

export type UserPageQuery = z.infer<typeof userPageQuerySchema>;
export { userPageQuerySchema };
