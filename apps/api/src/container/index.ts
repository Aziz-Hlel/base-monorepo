import { createMediaModule as mediaModule } from '@/media';
import { createUserModule as userModule } from '@/modules/User';
import accountModule from '@/modules/accounts';
import { authModule } from '@/modules/auth/auth.module';
import { createOwnerModule as ownerModule } from '@/modules/owner/owner.module';
import { createRootModule as rootModule } from '@/modules/root';
import { createSchoolModule as schoolModule } from '@/modules/schools/school.module';
import { createNotificationModule as notificationModule } from '@/notification';
import { SeedDevService } from '@/seeds/dev/seedDev.service';
import { AccountSeed } from '@/seeds/fakes/account.seed';
import { OwnerSeed } from '@/seeds/fakes/owner.seed';
import { SchoolSeed } from '@/seeds/fakes/school.seed';
import { UserSeed } from '@/seeds/fakes/users.fake';
import { Router } from 'express';

// * ROOT
const { rootRouter } = rootModule();

// * MEDIA
const { mediaRouter } = mediaModule();

// * ACCOUNT
const { accountRouter, accountService } = accountModule();

// * AUTH
const { authRouter } = authModule(accountService);

// * OWNER
const { ownerRouter, ownerService } = ownerModule();

// * SCHOOL
const { schoolRouter, schoolService } = schoolModule({ ownerService });

// * USER
const { userRouter, userRepo } = userModule({ accountService });
// const { authRouter } = createAuthModule(userInternalService);

// * NOTIFICATION
const { notificationRouter } = notificationModule({ userRepo });

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
  { router: authRouter, resource: 'auth' },
  { router: ownerRouter, resource: 'owners' },
  { router: schoolRouter, resource: 'schools' },

  { router: userRouter, resource: 'schools/:schoolId/users' },
  { router: notificationRouter, resource: 'notifications' },
];
