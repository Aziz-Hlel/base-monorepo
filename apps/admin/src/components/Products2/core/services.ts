import productService from '@/Api/service/productService';
import { createProductRequestSchema } from '@repo/contracts/schemas/product/createProductRequest';
import { updateProductRequestSchema } from '@repo/contracts/schemas/product/updateProductRequest';
import type { z } from 'zod';
import { defaultQuery, queryParamsSchema, type TableRowType } from './types';
import { ProductStatus } from '@repo/contracts/types/enums/enums';
import { TableData } from './core';

export type schemasType = {
  create: z.infer<typeof createProductRequestSchema>;
  update: z.infer<typeof updateProductRequestSchema>;
  delete: typeof productService.deleteProduct;
  getPage: typeof productService.getProducts;
};

function defineOperation<TSchema extends z.ZodType, TFn, T, K>(config: {
  fn: TFn;
  schema: TSchema;
  mutationKey: (arg: K) => string[];
  defaultValues: (params: T) => z.infer<TSchema>;
}) {
  return config;
}

const create = defineOperation({
  fn: productService.createProduct,
  schema: createProductRequestSchema,
  mutationKey: () => [TableData.MODULE_NAME, 'create'],
  defaultValues: () => {
    return {
      name: '',
      description: '',
      price: 0,
      thumbnailId: '',
      status: ProductStatus.AVAILABLE,
    };
  },
});

const update = defineOperation({
  fn: productService.updateProduct,
  schema: updateProductRequestSchema,
  mutationKey: () => [TableData.MODULE_NAME, 'update'],
  defaultValues: (moduleInstance: TableRowType) => ({
    name: moduleInstance.name,
    description: moduleInstance.description,
    price: moduleInstance.price,
    thumbnailId: moduleInstance.thumbnail?.id || '',
    status: moduleInstance.status,
  }),
});

const deleteOperation = {
  fn: productService.deleteProduct,
  mutationKey: () => [TableData.MODULE_NAME, 'delete'],
};

const getPage = defineOperation({
  fn: productService.getProducts,
  mutationKey: () => [TableData.MODULE_NAME, 'getPage'],
  schema: queryParamsSchema,
  defaultValues: () => defaultQuery,
});

type OperationsReqFields = {
  [x: string]: {
    mutationKey: (...args: any[]) => string[];
  };
};

export const operations = {
  create: create,
  update: update,
  delete: deleteOperation,
  getPage: getPage,
} as const satisfies OperationsReqFields;
