import { UserRole } from '@/generated/prisma/enums';
import { UserRoleService } from '@/modules/userRoles/userRole.service';

export class UserRolesSeed {
  constructor(private readonly userRoleService: UserRoleService) {}
  run = async ({ userId, role }: { userId: string; role: UserRole }) => {
    await this.userRoleService.grantRole_V2({ userId, role });
  };
}
