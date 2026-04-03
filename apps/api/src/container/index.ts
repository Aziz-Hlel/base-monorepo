import { createMediaModule } from '@/media';
import { createAuthModule, createUserModule } from '@/modules/User';
import createAccountModule from '@/modules/accounts';
import { createOwnerModule } from '@/modules/owner/owner.module';
import { createRootModule } from '@/modules/root';
import { createSchoolModule } from '@/modules/schools/school.module';
import { createNotificationModule } from '@/notification';
import { Router } from 'express';

// * ROOT
const { rootRouter } = createRootModule();

// * MEDIA
const { mediaRouter } = createMediaModule();

// * ACCOUNT
const { accountRouter, accountHelper } = createAccountModule();

// * OWNER
const { ownerRouter } = createOwnerModule({ accountHelper });

// * SCHOOL
const { schoolRouter } = createSchoolModule();

// * USER
const { userRouter, userInternalService, userRepo } = createUserModule();
const { authRouter } = createAuthModule(userInternalService);

// * NOTIFICATION
const { notificationRouter } = createNotificationModule({ userRepo });

export const container: { router: Router; resource: string }[] = [
  { router: rootRouter, resource: 'root' },
  { router: mediaRouter, resource: 'media' },

  { router: accountRouter, resource: 'accounts' },
  { router: ownerRouter, resource: 'owners' },
  { router: schoolRouter, resource: 'schools' },

  { router: userRouter, resource: 'users' },
  { router: authRouter, resource: 'auth' },
  { router: notificationRouter, resource: 'notifications' },
];
