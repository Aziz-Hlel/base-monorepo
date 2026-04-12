import { EmailRouter } from '@/email/email.route';
import { createMediaModule } from '@/media';
import { createExamModule } from '@/modules/Exam/exam.module';
import { createAuthModule, createUserModule } from '@/modules/User';
import { createMajorModule } from '@/modules/major/major.module';
import { createRootModule } from '@/modules/root';
import { createSchoolModule } from '@/modules/school/school.module';
import { createTeacherModule } from '@/modules/teacher/teacher.module';
import { SeedDevService } from '@/seeds/dev/seedDev.service';
import { ExamSeedService } from '@/seeds/fakes/exam.seed.service';
import { MajorSeedService } from '@/seeds/fakes/major.seed.service';
import { UserSeedService } from '@/seeds/fakes/user.seed.service';
import { Router } from 'express';

// * ROOT
const { rootRouter } = createRootModule();

// * MEDIA
const { mediaRouter, mediaService } = createMediaModule();

// * USER
const { userRouter, userInternalService, userService } = createUserModule();

// * AUTH
const { authRouter } = createAuthModule(userInternalService);

// * MAJOR
const { majorRouter, majorService } = createMajorModule();

// * EXAM
const { examRouter, examService } = createExamModule();

// * SCHOOL
const { schoolRouter, schoolService } = createSchoolModule(userInternalService);

// * TEACHER
const { teacherRouter, teacherService } = createTeacherModule({ schoolService });

// * SEED
const majorSeed = new MajorSeedService(majorService);
const examSeed = new ExamSeedService(examService);
const userSeed = new UserSeedService(userInternalService);
const devSeed = new SeedDevService(majorSeed, examSeed, userSeed);
devSeed.run();

export const container: { router: Router; resource: string }[] = [
  { router: rootRouter, resource: '' },
  { router: mediaRouter, resource: 'media' },
  { router: EmailRouter, resource: 'email' },
  { router: userRouter, resource: 'users' },
  { router: authRouter, resource: 'auth' },
  { router: majorRouter, resource: 'majors' },
  { router: examRouter, resource: 'exams' },
  { router: schoolRouter, resource: 'schools' },
  { router: teacherRouter, resource: 'schools/:schoolId/teachers' },
];
