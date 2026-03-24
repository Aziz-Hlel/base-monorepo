import { asyncHandler } from '@/core/async-handler';
import { Router } from 'express';
import { ProductController } from './product.controller';

export const createRouter = (productController: ProductController) => {
  const router = Router();
  router.post('/', asyncHandler(productController.create));
  router.get('/', asyncHandler(productController.getPage));
  router.get('/:id', asyncHandler(productController.getById));
  router.put('/:id', asyncHandler(productController.update));
  router.delete('/:id', asyncHandler(productController.delete));

  return router;
};
