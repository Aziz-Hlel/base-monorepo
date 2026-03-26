import { productsTableData, type ProductTableTypes } from '@repo/contracts/schemas/product/ProductPageQuery';

export type TableRowType = ProductTableTypes['TableRowType'];

export type TableRowKeys = ProductTableTypes['TableRowKeys'];

export const columnFiltersKeys = productsTableData.columnFiltersKeys;

export const sortableColumnKeys = productsTableData.sortableColumnKeys;

export const queryParamsSchema = productsTableData.queryParamsSchema;

export const defaultQuery = productsTableData.productDefaultQuery;

export type RequiredTableQueryParams = ProductTableTypes['RequiredProductTableQueryParams'];
