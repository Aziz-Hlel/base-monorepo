import { CreateProductRequest } from '@repo/contracts/schemas/product/createProductRequest';
import { ProductResponse } from '@repo/contracts/schemas/product/productResponse';
import { ProductMapper } from './product.mapper';
import { NotFoundError } from '@/err/customErrors';
import { UpdateProductRequest } from '@repo/contracts/schemas/product/updateProductRequest';
import { ProductPageQuery } from '@repo/contracts/schemas/product/ProductPageQuery';
import { ProductOrderByWithRelationInput, ProductWhereInput } from '@/generated/prisma/models';
import { Page } from '@repo/contracts/types/page/Page';
import { prisma } from '@/bootstrap/db.init';
import { ProductRepo } from './product.repo';
import { MediaService } from '@/media/media.service';

export interface IProductService {
  create(schema: CreateProductRequest): Promise<ProductResponse>;
  getById(productId: string): Promise<ProductResponse>;
  getPage(queryParams: ProductPageQuery): Promise<Page<ProductResponse>>;
  update(productId: string, schema: UpdateProductRequest): Promise<ProductResponse>;
  delete(productId: string): Promise<void>;
}

export class ProductService implements IProductService {
  constructor(
    private readonly productRepo: ProductRepo,
    private readonly mediaService: MediaService,
  ) {}
  async create(schema: CreateProductRequest): Promise<ProductResponse> {
    await this.mediaService.confirmMediaUploadById(schema.thumbnailId);

    const product = await this.productRepo.create(schema);
    const productThumbnail = await this.mediaService.generateMediaResponse(product.thumbnail);

    const productResponse = ProductMapper.toResponse({ product, thumbnail: productThumbnail });

    return productResponse;
  }

  async getById(productId: string): Promise<ProductResponse> {
    const product = await this.productRepo.findById({ productId });

    if (!product) {
      throw new NotFoundError(`Product with id ${productId} not found`);
    }
    const productThumbnail = await this.mediaService.generateMediaResponse(product.thumbnail);

    const productResponse = ProductMapper.toResponse({ product, thumbnail: productThumbnail });

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

    const { content, totalElements } = await this.productRepo.getPage({ skip, take, where, orderBy });

    const productsResponses = content.map((product) => {
      const thumbnail = this.mediaService.generateMediaResponse(product.thumbnail);
      return ProductMapper.toRowResponse({ product, thumbnail });
    });

    const productPage = ProductMapper.toProductPageResponse({
      content: productsResponses,
      totalElements,
      pagination: queryParams,
    });

    return productPage;
  }

  async update(productId: string, schema: UpdateProductRequest): Promise<ProductResponse> {
    const existingProduct = await this.productRepo.findById({ productId });

    if (!existingProduct) {
      throw new NotFoundError(`Product with id ${productId} not found`);
    }

    let thumbnailId: string | null = existingProduct.thumbnailId;
    const hasThumbnailChanged = schema.thumbnailId !== existingProduct.thumbnailId;
    if (hasThumbnailChanged) {
      const newThumbnailId = await this.mediaService.switchMediaIds({
        oldMediaKey: existingProduct.thumbnailId,
        newMediaKey: schema.thumbnailId,
      });
      thumbnailId = newThumbnailId;
    }

    const updatedProduct = await this.productRepo.update(productId, schema, thumbnailId);

    const thumbnailResponse = this.mediaService.generateMediaResponse(updatedProduct.thumbnail);

    const productResponse = ProductMapper.toResponse({ product: updatedProduct, thumbnail: thumbnailResponse });

    return productResponse;
  }

  async delete(productId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const existingProduct = await this.productRepo.findById({ productId, tx: tx.product });

      if (!existingProduct) return;

      const count = await this.productRepo.delete({ productId, tx: tx.product });

      if (count === 0) return;

      if (existingProduct.thumbnailId) {
        await this.mediaService.deleteMediaById({ mediaId: existingProduct.thumbnailId, tx: tx.media });
      }
    });
  }
}
