import { faker } from '@faker-js/faker';
import { prisma } from '../../bootstrap/db.init';
import { Role, Status } from '@/generated/prisma/enums';

faker.seed(1); // Ensure consistent fake data across runs

const createFakeUser = (index: number) => {
  const fakeEmail = `user${index}@example.com`;
  const fakeUser = {
    email: fakeEmail,
    username: faker.internet.username(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    authId: faker.string.uuid(),
    provider: faker.helpers.arrayElement(['fake', 'google.com', 'apple.com', 'password']),
    role: faker.helpers.arrayElement(Object.values(Role)),
    status: faker.helpers.arrayElement(Object.values(Status)),
    isEmailVerified: faker.datatype.boolean(),
    profile: {
      phoneNumber: faker.phone.number(),
      address: faker.location.streetAddress(),
      avatar: null,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    },
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
      create: { ...user, profile: { create: user.profile } },
      update: { ...user, profile: { update: user.profile } },
    });
  }
};

export default seedUsers;
