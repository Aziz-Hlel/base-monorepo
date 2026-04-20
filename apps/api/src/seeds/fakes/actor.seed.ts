import { UserRole } from '@/generated/prisma/enums';
import { UserSeed } from './users.fake';
import { StaffSeed } from './staff.seed';
import { UserRolesSeed } from './userRoles.seed';
import { TeacherSeed } from './teacher.seed';

export class ActorSeed {
  constructor(
    private readonly userRolesSeed: UserRolesSeed,
    private readonly teacherSeed: TeacherSeed,
  ) {}
  run = async ({ role, userId }: { role: UserRole; userId: string }) => {
    switch (role) {
      case UserRole.NURSE:
      case UserRole.DRIVER:
      case UserRole.DIRECTOR:
      case UserRole.MANAGER:
        await this.userRolesSeed.run({ role, userId });
        break;
      case UserRole.TEACHER:
        await this.userRolesSeed.run({ role, userId });
        await this.teacherSeed.run({ userId });
        break;
      case UserRole.PARENT:
        await this.userRolesSeed.run({ role, userId });
        break;

      default:
        break;
    }
  };
}
