import { createProductRequestSchema } from '@repo/contracts/schemas/product/createProductRequest';
import { productService } from './product.service';
import { Request, Response } from 'express';
import { ProductResponse } from '@repo/contracts/schemas/product/productResponse';
import { updateProductRequestSchema } from '@repo/contracts/schemas/product/updateProductRequest';
import { SimpleApiResponse } from '@repo/contracts/types/api/SimpleApiResponse.dto';
import { productsQueryParamsSchema } from '@repo/contracts/schemas/product/ProductPageQuery';
import getParam from '@/utils/getParam';

class ProductController {
  async create(req: Request, res: Response<ProductResponse>) {
    const parsedSchema = createProductRequestSchema.parse(req.body);

    const productResponse = await productService.create(parsedSchema);

    res.status(201).json(productResponse);
  }

  async getById(req: Request, res: Response<ProductResponse>) {
    const productId = getParam(req, 'id');

    const productResponse = await productService.getById(productId);
    res.status(200).json(productResponse);
  }

  async update(req: Request, res: Response<ProductResponse>) {
    const productId = getParam(req, 'id');
    const parsedSchema = updateProductRequestSchema.parse(req.body);
    const productResponse = await productService.update(productId, parsedSchema);

    res.status(200).json(productResponse);
  }

  async getPage(req: Request, res: Response) {
    const queryParams = productsQueryParamsSchema.parse(req.query);
    const productPage = await productService.getPage(queryParams);

    res.status(200).json(productPage);
  }

  async delete(req: Request, res: Response<SimpleApiResponse>) {
    const productId = getParam(req, 'id');

    await productService.delete(productId);

    res.status(200).send({ message: 'Product deleted successfully' });
  }
}

export const productController = new ProductController();
