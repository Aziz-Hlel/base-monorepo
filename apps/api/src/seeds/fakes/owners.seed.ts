import { prisma } from '@/bootstrap/db.init';
import { firebaseAuthService } from '@/firebase/service/firebase.auth.service';
import { AccountRole } from '@/generated/prisma/enums';
import { faker } from '@faker-js/faker';

const seedOwner = async ({
  accountId,
  accountRole,
  authId,
}: {
  accountId: string;
  accountRole: AccountRole;
  authId: string;
}) => {
  const owner = await prisma.owner.findUnique({
    where: { accountId },
    include: {
      school: true,
    },
  });
  if (owner) {
    return owner;
  }
  const createdOwner = await prisma.owner.create({
    data: {
      accountId,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phoneNumber: faker.phone.number(),
    },
    include: {
      school: true,
    },
  });

  await firebaseAuthService.setAccountClaims({
    authId: authId,
    claims: {
      id: accountId,
      role: accountRole,
      users: [],
    },
  });
  return createdOwner;
};

export default seedOwner;
