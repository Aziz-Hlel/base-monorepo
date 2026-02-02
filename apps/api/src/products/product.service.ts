import { mediaService } from '@/media/media.service';
import { CreateProductRequest } from '@contracts/schemas/product/createProductRequest';
import { productRepo } from './product.repo';
import { ProductResponse } from '@contracts/schemas/product/productResponse';
import { ProductMapper } from './product.mapper';
import { NotFoundError } from '@/err/customErrors';
import { UpdateProductRequest } from '@contracts/schemas/product/updateProductRequest';
import { ProductPageQuery } from '@contracts/schemas/product/ProductPageQuery';
import { ProductOrderByWithRelationInput, ProductWhereInput } from '@/generated/prisma/models';
import { Page } from '@contracts/types/page/Page';

class ProductService {
  async create(schema: CreateProductRequest): Promise<ProductResponse> {
    await mediaService.confirmMediaUploadById(schema.thumbnailId);

    const product = await productRepo.create(schema);

    const productResponse = ProductMapper.toResponse(product);

    return productResponse;
  }

  async getById(productId: string): Promise<ProductResponse> {
    const product = await productRepo.findById(productId);

    if (!product) {
      throw new NotFoundError(`Product with id ${productId} not found`);
    }
    const productResponse = ProductMapper.toResponse(product);

    return productResponse;
  }

  async getPage(queryParams: ProductPageQuery): Promise<Page<ProductResponse>> {
    const skip = (queryParams.page - 1) * queryParams.size;
    const take = queryParams.size;
    const { search } = queryParams;

    const where: ProductWhereInput = {};

    if (search.length > 0) {
      const searchValue = search.toLowerCase();
      where.name = { contains: searchValue, mode: 'insensitive' };
    }

    if (queryParams.status.length) {
      where.status = { in: queryParams.status };
    }

    const orderBy: ProductOrderByWithRelationInput = {};

    if (queryParams.sort) {
      orderBy[queryParams.sort] = queryParams.order;
    }

    const { content, totalElements } = await productRepo.getPage({ skip, take, where, orderBy });

    const productPage = ProductMapper.toProductPageResponse({
      products: content,
      totalElements,
      pagination: queryParams,
    });

    return productPage;
  }

  async update(productId: string, schema: UpdateProductRequest): Promise<ProductResponse> {
    const existingProduct = await productRepo.findById(productId);

    if (!existingProduct) {
      throw new NotFoundError(`Product with id ${productId} not found`);
    }

    let thumbnailId: string | null = existingProduct.thumbnailId;
    const hasThumbnailChanged = schema.thumbnailId !== existingProduct.thumbnailId;
    if (hasThumbnailChanged) {
      const newThumbnailId = await mediaService.switchMediaIds({
        oldMediaKey: existingProduct.thumbnailId,
        newMediaKey: schema.thumbnailId,
      });
      thumbnailId = newThumbnailId;
    }

    const updatedProduct = await productRepo.update(productId, schema, thumbnailId);

    const productResponse = ProductMapper.toResponse(updatedProduct);

    return productResponse;
  }

  async delete(productId: string): Promise<void> {
    const existingProduct = await productRepo.findById(productId);

    if (!existingProduct) {
      throw new NotFoundError(`Product with id ${productId} not found`);
    }

    if (existingProduct.thumbnailId) {
      await mediaService.deleteMediaById(existingProduct.thumbnailId);
    }

    await productRepo.delete(productId);
  }
}

export const productService = new ProductService();
