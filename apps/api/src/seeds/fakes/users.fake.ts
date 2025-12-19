import { faker } from '@faker-js/faker';
import { User } from '../../generated/prisma/client';
import { prisma } from '../../bootstrap/db.init';
import { Role, Status } from '@/types/enums/enums';

faker.seed(1); // Ensure consistent fake data across runs

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
    role: faker.helpers.arrayElement(Object.values(Role)),
    status: faker.helpers.arrayElement(Object.values(Status)),
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
      update: user,
    });
  }
};

export default seedUsers;
