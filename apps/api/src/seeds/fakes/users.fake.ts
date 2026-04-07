import { faker } from '@faker-js/faker/dist/';
import { prisma } from '../../bootstrap/db.init';
import pMap from 'p-map';

faker.seed(1); // Ensure consistent fake data across runs

const createFakeUser = (index: number) => {
  const fakeEmail = `fake-user-${index}@fake.com`;
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

const seedUser = async () => {
  await prisma.$transaction(async (tx) => {});
};
