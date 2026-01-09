import { prisma } from '@/bootstrap/db.init';
import { ProductInclude, ProductOrderByWithRelationInput, ProductWhereInput } from '@/generated/prisma/models';
import { CreateProductRequest } from '@contracts/schemas/product/createProductRequest';
import { UpdateProductRequest } from '@contracts/schemas/product/updateProductRequest';
import { DefaultArgs } from '@prisma/client/runtime/client';

class ProductRepo {
  private includeThumbnail() {
    return {
      thumbnail: true,
    } as const satisfies ProductInclude<DefaultArgs>;
  }
  async create(schema: CreateProductRequest) {
    const product = await prisma.product.create({
      data: {
        ...schema,
      },
      include: this.includeThumbnail(),
    });
    return product;
  }

  async findById(productId: string) {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: this.includeThumbnail(),
    });
    return product;
  }

  async update(productId: string, schema: UpdateProductRequest, thumbnailId: string | null) {
    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        ...schema,
        thumbnailId,
      },
      include: this.includeThumbnail(),
    });
    return product;
  }

  async delete(productId: string): Promise<void> {
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });
  }

  async getPage({
    skip,
    take,
    where,
    orderBy,
  }: {
    skip: number;
    take: number;
    where: ProductWhereInput;
    orderBy: ProductOrderByWithRelationInput;
  }) {
    const products = prisma.product.findMany({
      skip,
      take,
      where,
      orderBy,
      include: this.includeThumbnail(),
    });
    const productsCount = prisma.product.count({ where });

    const [content, totalElements] = await Promise.all([products, productsCount]);

    return { content, totalElements };
  }
}

export const productRepo = new ProductRepo();
