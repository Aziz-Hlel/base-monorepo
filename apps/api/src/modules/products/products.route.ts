import { asyncHandler } from '@/core/async-handler';
import { Router } from 'express';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepo } from './product.repo';

const createRouter = (productController: ProductController) => {
  const router = Router();
  router.post('/', asyncHandler(productController.create));
  router.get('/', asyncHandler(productController.getPage));
  router.get('/:id', asyncHandler(productController.getById));
  router.put('/:id', asyncHandler(productController.update));
  router.delete('/:id', asyncHandler(productController.delete));

  return router;
};

const repo = new ProductRepo();
const service = new ProductService(repo);
const controller = new ProductController(service);
const router = createRouter(controller);

export const productRouter = router;
