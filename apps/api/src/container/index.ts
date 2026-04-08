import { createMediaModule } from '@/media';
import { createUserModule } from '@/modules/User';
import createAccountModule from '@/modules/accounts';
import { createOwnerModule } from '@/modules/owner/owner.module';
import { createRootModule } from '@/modules/root';
import { createSchoolModule } from '@/modules/schools/school.module';
import { createNotificationModule } from '@/notification';
import { SeedDevService } from '@/seeds/dev/seedDev.service';
import { AccountSeed } from '@/seeds/fakes/account.seed';
import { OwnerSeed } from '@/seeds/fakes/owner.seed';
import { SchoolSeed } from '@/seeds/fakes/school.seed';
import { UserSeed } from '@/seeds/fakes/users.fake';
import { Router } from 'express';

// * ROOT
const { rootRouter } = createRootModule();

// * MEDIA
const { mediaRouter } = createMediaModule();

// * ACCOUNT
const { accountRouter, accountService } = createAccountModule();

// * OWNER
const { ownerRouter, ownerService } = createOwnerModule();

// * SCHOOL
const { schoolRouter, schoolService } = createSchoolModule({ ownerService });

// * USER
const { userRouter, userRepo } = createUserModule({ accountService });
// const { authRouter } = createAuthModule(userInternalService);

// * NOTIFICATION
const { notificationRouter } = createNotificationModule({ userRepo });

const accountSeed = new AccountSeed(accountService);
const ownerSeed = new OwnerSeed(ownerService);
const schoolSeed = new SchoolSeed();
const userSeed = new UserSeed();
const seedDevService = new SeedDevService(accountSeed, ownerSeed, schoolSeed, userSeed);
seedDevService.run();

export const container: { router: Router; resource: string }[] = [
  { router: rootRouter, resource: 'root' },
  { router: mediaRouter, resource: 'media' },

  { router: accountRouter, resource: 'accounts' },
  { router: ownerRouter, resource: 'owners' },
  { router: schoolRouter, resource: 'schools' },

  { router: userRouter, resource: 'schools/:schoolId/users' },
  // { router: authRouter, resource: 'auth' },
  { router: notificationRouter, resource: 'notifications' },
];
