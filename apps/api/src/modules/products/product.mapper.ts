import { Product } from '@/generated/prisma/client';
import { ProductWithThumbnail } from '@/types/getPayload';
import { MediaResponse } from '@repo/contracts/schemas/media/MediaResponse';
import { ProductResponse } from '@repo/contracts/schemas/product/productResponse';
import { ProductRowResponse } from '@repo/contracts/schemas/product/productRowResponse';
import { DefaultSearchParams } from '@repo/contracts/types/api/DefaultSeachParams';
import { Page } from '@repo/contracts/types/page/Page';

export class ProductMapper {
  static toResponse(params: { product: ProductWithThumbnail; thumbnail: MediaResponse | null }): ProductResponse {
    return {
      id: params.product.id,
      name: params.product.name,
      description: params.product.description,
      price: Number(params.product.price),
      thumbnail: params.thumbnail,
      createdAt: params.product.createdAt.toISOString(),
      updatedAt: params.product.updatedAt.toISOString(),
    };
  }
  static toRowResponse(params: { product: ProductWithThumbnail; thumbnail: MediaResponse | null }): ProductRowResponse {
    return {
      id: params.product.id,
      name: params.product.name,
      description: params.product.description,
      price: Number(params.product.price),
      thumbnail: params.thumbnail,
      status: params.product.status,
      createdAt: params.product.createdAt.toISOString(),
      updatedAt: params.product.updatedAt.toISOString(),
    };
  }

  static toProductRowResponses(params: {
    products: ProductWithThumbnail[];
    thumbnails: Record<string, MediaResponse>;
  }): ProductRowResponse[] {
    return params.products.map((product) => this.toRowResponse({ product, thumbnail: params.thumbnails[product.id] }));
  }

  static toProductPageResponse(params: {
    content: ProductRowResponse[];
    totalElements: number;
    pagination: DefaultSearchParams;
  }): Page<ProductRowResponse> {
    return {
      content: params.content,
      pagination: {
        number: params.pagination.page,
        size: params.pagination.size,
        totalElements: params.totalElements,
        totalPages: Math.ceil(params.totalElements / params.pagination.size),
        offset: params.pagination.page * params.pagination.size,
        pageSize: params.content.length,
      },
    };
  }
}
