import { asyncHandler } from '@/core/async-handler';
import { Router } from 'express';

import { Request, Response } from 'express';
import { productController } from './product.controller';

const router = Router();

router.post(
  '/',
  asyncHandler((req: Request, res: Response) => productController.create(req, res)),
);

router.get(
  '/',
  asyncHandler((req: Request, res: Response) => productController.getPage(req, res)),
);

router.get(
  '/:productId',
  asyncHandler((req: Request, res: Response) => productController.getById(req, res)),
);

router.put(
  '/:productId',
  asyncHandler((req: Request, res: Response) => productController.update(req, res)),
);

router.delete(
  '/:productId',
  asyncHandler((req: Request, res: Response) => productController.delete(req, res)),
);

export const productRouter = router;
