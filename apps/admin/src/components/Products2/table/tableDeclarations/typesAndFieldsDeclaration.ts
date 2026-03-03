import type { ProductRowResponse } from '@contracts/schemas/product/productRowResponse';

export type TableRowType = ProductRowResponse;
// export type NestedObject = Prettify<NonNullable<TableRowType['profile']>>;
export type TableRowKeys = keyof TableRowType;

export const columnFiltersKeys: Set<TableRowKeys> = new Set(['status'] as const);

export const sortableColumnKeys: TableRowKeys[] = [
  'name',
  'description',
  'price',
  'status',
  'createdAt',
  'updatedAt',
] as const;
