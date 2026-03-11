import { prisma } from '@/bootstrap/db.init';
import { firebaseAuthService } from '@/firebase/service/firebase.auth.service';
import { firebaseUserService } from '@/firebase/service/firebase.user.service';
import { Role } from '@/generated/prisma/enums';
import { faker } from '@faker-js/faker';

const prodUsers = [
  {
    email: 'tigana137@gmail.com',
    username: 'Tigana',
    role: Role.SUPER_ADMIN,
    authId: 'google-oauth2|11223344556677889900',
    provider: 'google.com',
    isEmailVerified: true,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  },
] as const;

export const seedProdUsers = async () => {
  prodUsers.forEach(async (user) => {
    const userExists = await prisma.user.findUnique({
      where: { email: user.email },
    });
    if (userExists) {
      return;
    }
    const userRecord = await firebaseUserService.createUser({
      email: user.email,
      password: 'SecureP@ssw0rd!',
      displayName: user.username,
      role: user.role,
    });

    const data = {
      authId: userRecord.uid,
      email: user.email,
      username: user.username,
      role: user.role,
      provider: user.provider,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const createdUser = await prisma.user.create({
      data,
    });

    await firebaseAuthService.setCustomUserClaims({
      userId: createdUser.id,
      userAuthId: createdUser.authId,
      userRole: createdUser.role,
    });
  });
};
