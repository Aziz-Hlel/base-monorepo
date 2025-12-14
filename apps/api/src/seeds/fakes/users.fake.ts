import { faker } from '@faker-js/faker';
import type { User } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

const createFakeUser = (index: number) => {
  const fakeEmail = `user${index}@example.com`;
  const fakeUser: User = {
    id: faker.string.uuid(),
    email: fakeEmail,
    username: faker.internet.username(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    authId: faker.string.uuid(),
    provider: faker.helpers.arrayElement(['fake']),
    role: faker.helpers.arrayElement(['USER', 'ADMIN']),
    status: faker.helpers.arrayElement(['ACTIVE', 'INACTIVE', 'PENDING', 'DELETED']),
    isEmailVerified: faker.datatype.boolean(),
  };
  return fakeUser;
};

const seedUsers = async (nbr: number) => {
  const fakeUsers = faker.helpers.multiple((_, index) => createFakeUser(index), {
    count: nbr,
  });
  for (const user of fakeUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      create: user,
      update: {},
    });
  }
};

export default seedUsers;
