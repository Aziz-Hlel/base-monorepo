import { ProductController } from './product.controller';
import { ProductRepo } from './product.repo';
import { ProductService } from './product.service';
import { createRouter } from './products.route';
import { MediaService } from '@/media/media.service';

export const createProductModule = (mediaService: MediaService) => {
  const repo = new ProductRepo();
  const service = new ProductService(repo, mediaService);
  const controller = new ProductController(service);
  const productRouter = createRouter(controller);

  return { productRouter };
};
