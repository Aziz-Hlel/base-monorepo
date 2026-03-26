import productService from '@/Api/service/productService';
import { createProductRequestSchema } from '@repo/contracts/schemas/product/createProductRequest';
import { updateProductRequestSchema } from '@repo/contracts/schemas/product/updateProductRequest';
import type { z } from 'zod';
import { defaultQuery, queryParamsSchema } from './types';

export const services = {
  getPage: productService.getProducts,
  create: productService.createProduct,
  update: productService.updateProduct,
  delete: productService.deleteProduct,
};

export type schemasType = {
  create: typeof productService.createProduct;
  update: typeof productService.updateProduct;
  delete: typeof productService.deleteProduct;
  getPage: typeof productService.getProducts;
};

function defineOperation<TSchema extends z.ZodType, TFn>(config: {
  fn: TFn;
  schema: TSchema;
  defaultValues: z.infer<TSchema>;
}) {
  return config;
}

type Operations<TSchema extends z.ZodType, TFn> = {
  create: {
    fn: TFn;
    schema: TSchema;
    defaultValues: z.infer<TSchema>;
  };
};

export const operations: Operations = {
  create: defineOperation({
    fn: productService.createProduct,
    schema: createProductRequestSchema,
    defaultValues: {
      description: '',
      thumbnailId: '',
    },
  }),
  update: {
    fn: productService.updateProduct,
    schema: updateProductRequestSchema,
    defaultValues: {
      description: '',
      thumbnailId: '',
    },
  },
  delete: {
    fn: productService.deleteProduct,
  },
  getPage: {
    fn: productService.getProducts,
    schema: queryParamsSchema,
    defaultValues: defaultQuery,
  },
};
