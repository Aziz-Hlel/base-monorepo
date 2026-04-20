import { createMediaModule as mediaModule } from '@/media';
import { parentStudentModule } from '@/modules/ParentStudent/parentStudent.module';
import { createUserModule as userModule } from '@/modules/User';
import { AccountModule } from '@/modules/accounts/account.module';
import { authModule } from '@/modules/auth/auth.module';
import { ClassroomModule } from '@/modules/classroom/classroom.module';
import { createOwnerModule as ownerModule } from '@/modules/owner/owner.module';
import { ParentModule } from '@/modules/parent/parent.module';
import { createRootModule as rootModule } from '@/modules/root/root.module';
import { createSchoolModule as schoolModule } from '@/modules/schools/school.module';
import { StaffModule } from '@/modules/staff/staff.module';
import { StudentModule } from '@/modules/student/student.module';
import { StudentProfileModule } from '@/modules/studentProfile/studentProfile.module';
import { TeacherModule } from '@/modules/teacher/teacher.module';
import { createUserRoleModule } from '@/modules/userRoles/userRole.module';
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
const { accountRouter, accountService } = AccountModule();

// * OWNER
const { ownerRouter, ownerService } = ownerModule();

// * SCHOOL
const { schoolRouter, schoolService } = schoolModule({ ownerService });

// * USER
const { userRouter, userRepo, createSimpleUserUseCase, userService } = userModule({ accountService });

// * USER ROLE
const { userRoleRouter, userRoleService } = createUserRoleModule();

// * STAFF
const { staffRouter } = StaffModule({ createSimpleUserUseCase, userService });

// * TEACHER
const { teacherRouter } = TeacherModule({ createSimpleUserUseCase, userService });

// * CLASS
const { classRouter } = ClassroomModule();

// * PARENT STUDENT
const { parentStudentRouter, parentStudentService } = parentStudentModule();

// * PARENT
const { parentService, parentRepo } = ParentModule();

// * STUDENT
const { studentRouter, studentService } = StudentModule({
  userRepo,
  parentStudentService,
  userRoleService,
  createSimpleUserUseCase,
  parentService,
  parentRepo,
});

// * STUDENT PROFILE
const { studentProfileRouter, studentProfileService } = StudentProfileModule();

// *
// * AUTH
const { authRouter } = authModule(accountService);

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
  { router: staffRouter, resource: 'schools/:schoolId/staff' },
  { router: teacherRouter, resource: 'schools/:schoolId/teachers' },
  { router: classRouter, resource: 'schools/:schoolId/classrooms' },
  { router: studentRouter, resource: 'schools/:schoolId/students' },
  { router: studentProfileRouter, resource: 'schools/:schoolId/students/:studentId/profile' },
  { router: parentStudentRouter, resource: 'schools/:schoolId/students/:studentId/parents/:parentId' },

  { router: userRouter, resource: 'schools/:schoolId/users' },
  { router: userRoleRouter, resource: 'schools/:schoolId/users/:userId/roles' },
  { router: notificationRouter, resource: 'notifications' },
];
