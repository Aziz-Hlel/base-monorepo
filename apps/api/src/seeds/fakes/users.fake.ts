import { prisma } from '@/bootstrap/db.init';
import { Gender, UserRole, UserStatus } from '@/generated/prisma/enums';
import { UserCreateInput } from '@/generated/prisma/models';
import { faker } from '@faker-js/faker/.';

export class UserSeed {
  constructor() {}

  generateFakeSimpleUser = ({
    accountId,
    schoolId,
    role,
  }: {
    accountId: string;
    schoolId: string;
    role?: UserRole;
  }): UserCreateInput => {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      gender: faker.helpers.arrayElement(Object.values(Gender)),
      dateOfBirth: faker.date.past(),
      phone: faker.phone.number(),
      cin: faker.string.numeric(8),
      address: faker.location.streetAddress(),
      status: faker.helpers.arrayElement(Object.values(UserStatus)),

      roles: {
        create: {
          role: role ?? faker.helpers.arrayElement(Object.values(UserRole)),
        },
      },
      account: {
        connect: {
          id: accountId,
        },
      },
      school: {
        connect: {
          id: schoolId,
        },
      },

      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };
  };

  run = async ({ accountId, schoolId, role }: { accountId: string; schoolId: string; role?: UserRole }) => {
    const user = this.generateFakeSimpleUser({ accountId, schoolId, role });
    const createdUser = await prisma.user.upsert({
      where: {
        accountId_schoolId: {
          accountId,
          schoolId,
        },
      },
      create: user,
      update: {},
    });
    return createdUser;
  };
}
