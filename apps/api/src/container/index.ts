import { EmailRouter } from '@/email/email.route';
import { createMediaModule } from '@/media';
import { createExamModule } from '@/modules/Exam/exam.module';
import { createAuthModule, createUserModule } from '@/modules/User';
import { createMajorModule } from '@/modules/major/major.module';
import { createRootModule } from '@/modules/root';
import { SeedDevService } from '@/seeds/dev/seedDev.service';
import { ExamSeedService } from '@/seeds/fakes/exam.seed.service';
import { MajorSeedService } from '@/seeds/fakes/major.seed.service';
import { Router } from 'express';

// * ROOT
const { rootRouter } = createRootModule();

// * MEDIA
const { mediaRouter, mediaService } = createMediaModule();

// * USER
const { userRouter, userInternalService } = createUserModule();

// * AUTH
const { authRouter } = createAuthModule(userInternalService);

// * MAJOR
const { majorRouter, majorService } = createMajorModule();

// * EXAM
const { examRouter, examService } = createExamModule();

// * SEED
const majorSeed = new MajorSeedService(majorService);
const examSeed = new ExamSeedService(examService);
const devSeed = new SeedDevService(majorSeed, examSeed);
devSeed.run();

export const container: { router: Router; resource: string }[] = [
  { router: rootRouter, resource: '' },
  { router: mediaRouter, resource: 'media' },
  { router: EmailRouter, resource: 'email' },
  { router: userRouter, resource: 'users' },
  { router: authRouter, resource: 'auth' },
  { router: majorRouter, resource: 'majors' },
  { router: examRouter, resource: 'exams' },
];
