import { prisma } from '@/bootstrap/db.init';
import { ProductInclude, ProductOrderByWithRelationInput, ProductWhereInput } from '@/generated/prisma/models';
import { CreateProductRequest } from '@repo/contracts/schemas/product/createProductRequest';
import { UpdateProductRequest } from '@repo/contracts/schemas/product/updateProductRequest';
import { DefaultArgs } from '@prisma/client/runtime/client';
import { ProductTransaction } from '@/types/transactions';

export class ProductRepo {
  private includeThumbnail() {
    return {
      thumbnail: true,
    } as const satisfies ProductInclude<DefaultArgs>;
  }
  async create(schema: CreateProductRequest) {
    const product = await prisma.product.create({
      data: { ...schema },
      include: this.includeThumbnail(),
    });
    return product;
  }

  async findById(props: { productId: string; tx?: ProductTransaction }) {
    const orm = props.tx ?? prisma.product;
    const product = await orm.findUnique({
      where: { id: props.productId },
      include: this.includeThumbnail(),
    });
    return product;
  }

  async update(productId: string, schema: UpdateProductRequest, thumbnailId: string | null) {
    const product = await prisma.product.update({
      where: { id: productId },
      data: { ...schema, thumbnailId },
      include: this.includeThumbnail(),
    });
    return product;
  }

  async delete(props: { productId: string; tx?: ProductTransaction }) {
    const orm = props.tx ?? prisma.product;
    const { count } = await orm.deleteMany({ where: { id: props.productId } });
    return count;
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
