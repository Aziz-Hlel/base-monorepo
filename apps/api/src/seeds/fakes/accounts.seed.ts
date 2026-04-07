import { prisma } from '@/bootstrap/db.init';
import { firebaseUserService } from '@/firebase/service/firebase.user.service';
import { AccountRole, AccountStatus, Prisma } from '@/generated/prisma/client';
import { faker } from '@faker-js/faker/dist/';

type CreateAccountPayload = Prisma.XOR<Prisma.AccountCreateInput, Prisma.AccountUncheckedCreateInput>;

const accountInclude = {
  owner: { include: { school: true } },
  users: { include: { parent: { include: { students: true } }, teacher: true, roles: true, school: true } },
} as const satisfies Prisma.AccountInclude;

const seedAccount = async ({ email, accountRole }: { email: string; accountRole?: AccountRole }) => {
  const accountExists = await prisma.account.findUnique({
    where: { email },
    include: accountInclude,
  });
  if (accountExists) {
    return accountExists;
  }
  const accountRecord = await firebaseUserService.createAccount({
    email: email,
    password: '12345678',
    displayName: faker.internet.username(),
  });

  const seedAccount = {
    email,
    username: faker.internet.username(),
    authId: accountRecord.uid,
    role: accountRole ?? faker.helpers.arrayElement(Object.values(AccountRole)),
    provider: faker.helpers.arrayElement(['fake', 'google.com', 'apple.com', 'password']),
    status: AccountStatus.ACTIVE,
    isEmailVerified: faker.datatype.boolean(),

    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  } as const satisfies CreateAccountPayload;

  const account = await prisma.account.upsert({
    where: { email: seedAccount.email },
    create: { ...seedAccount },
    update: {},
    include: accountInclude,
  });

  return account;
};

export default seedAccount;
