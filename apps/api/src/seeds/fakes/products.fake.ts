import { prisma } from '@/bootstrap/db.init';
import { ProductStatus } from '@/generated/prisma/enums';
import { faker } from '@faker-js/faker';
import { fakeProductsData, fakeProductsThumbnailPrefix } from './products.data';
import generateSeedMedia from '../helper/generateSeedMedia';
import pMap from 'p-map';

faker.seed(1); // Ensure consistent fake data across runs

const fakeProducts = fakeProductsData.map((product) => ({
  name: product.name,
  description: product.description,
  price: faker.finance.amount({ min: 10, max: 1000 }),
  status: faker.helpers.arrayElement(Object.values(ProductStatus)),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  thumbnail: {
    ...generateSeedMedia({ prefix: fakeProductsThumbnailPrefix, baseName: product.thumbnailBaseName }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  },
}));

export const seedProducts = async () => {
  const dbQuery = (product: (typeof fakeProducts)[0]) => {
    return prisma.product.upsert({
      where: { name: product.name },
      create: {
        description: product.description,
        name: product.name,
        price: product.price,
        status: product.status,
        thumbnail: {
          connectOrCreate: {
            where: { key: product.thumbnail.key },
            create: product.thumbnail,
          },
        },
      },
      update: {},
    });
  };
  await pMap(fakeProducts, dbQuery, { concurrency: 10 });
};
