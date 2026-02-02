import { Product } from '@/generated/prisma/client';
import { mediaService } from '@/media/media.service';
import { ProductWithThumbnail } from '@/types/getPayload';
import { ProductResponse } from '@contracts/schemas/product/productResponse';
import { ProductRowResponse } from '@contracts/schemas/product/productRowResponse';
import { DefaultSearchParams } from '@contracts/types/api/DefaultSeachParams';
import { Page } from '@contracts/types/page/Page';

export class ProductMapper {
  static toResponse(product: ProductWithThumbnail): ProductResponse {
    const thumbnail = mediaService.getMediaKeyAndUrl(product.thumbnail);
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      thumbnail: thumbnail,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }
  static toRowResponse(product: ProductWithThumbnail): ProductRowResponse {
    const thumbnail = mediaService.getMediaKeyAndUrl(product.thumbnail);
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      thumbnail: thumbnail,
      status: product.status,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }

  static toProductRowResponses(products: ProductWithThumbnail[]): ProductRowResponse[] {
    return products.map(this.toRowResponse);
  }

  static toProductPageResponse(params: {
    products: ProductWithThumbnail[];
    totalElements: number;
    pagination: DefaultSearchParams;
  }): Page<ProductRowResponse> {
    const productRowResponses = this.toProductRowResponses(params.products);
    return {
      content: productRowResponses,
      pagination: {
        number: params.pagination.page,
        size: params.pagination.size,
        totalElements: params.totalElements,
        totalPages: Math.ceil(params.totalElements / params.pagination.size),
        offset: params.pagination.page * params.pagination.size,
        pageSize: params.products.length,
      },
    };
  }
}
