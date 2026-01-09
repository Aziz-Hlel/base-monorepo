import z from 'zod';
import { ProductStatus } from '../../types/enums/enums';
import { ProductRowResponse } from './productRowResponse';

export type TableRowType = ProductRowResponse;

export type RootKeys = keyof TableRowType;
export type TableRowKeys = RootKeys;

export const columnFiltersKeys: Set<TableRowKeys> = new Set(['status'] as const);

export const sortableColumnKeys: TableRowKeys[] = [
  'name',
  'description',
  'price',
  'createdAt',
  'status',
  'updatedAt',
] as const;

export const ProductPageQuerySortFields: RootKeys[] = ['createdAt', 'name', 'status', 'price'];

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

export const productsQueryParamsSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  size: z.coerce.number().int().min(5).max(50).catch(10),
  sort: z.enum(sortableColumnKeys).catch('createdAt'),
  order: z.enum(['asc', 'desc']).catch('desc'),
  search: z.string().trim().catch(''),
  // Filters
  status: csvEnumArray(Object.values(ProductStatus)).catch([]),
});
export type TableQueryParams = z.infer<typeof productsQueryParamsSchema>;
export type RequiredTableQueryParams = TableQueryParams;

export const productDefaultQuery: RequiredTableQueryParams = {
  page: 1,
  size: 10,
  sort: 'updatedAt',
  order: 'desc',
  search: '',
  status: [],
};

export type ProductPageQuery = z.infer<typeof productsQueryParamsSchema>;
