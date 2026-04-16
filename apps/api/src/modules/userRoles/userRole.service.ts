import { UserRoleSimple } from '@repo/contracts/types/enums/meta/userRoleMeta';
import { UserRoleRepo } from './userRole.repo';
import { prisma } from '@/bootstrap/db.init';
import { ConflictError } from '@/err/service/customErrors';

export class UserRoleService {
  constructor(private readonly userRoleRepo: UserRoleRepo) {}

  grantSimpleRole = async ({ userId, role }: { userId: string; role: UserRoleSimple }) => {
    const existingRole = await this.userRoleRepo.findByUserIdAndRole({ userId, role });
    if (existingRole) {
      return { role: existingRole, type: 'EXISTING' } as const;
    }
    const createdUserRole = await this.userRoleRepo.grantSimpleRole({ userId, role });
    return { role: createdUserRole, type: 'NEW' } as const;
  };

  revokeSimpleRole = async ({ userId, role }: { userId: string; role: UserRoleSimple }) => {
    const existingRole = await this.userRoleRepo.findByUserIdAndRole({ userId, role });
    if (!existingRole) {
      return { role: null, type: 'NOT_FOUND' } as const;
    }
    const userRolesCount = await prisma.userRoles.count({
      where: {
        userId,
      },
    });
    if (userRolesCount === 1) {
      throw new ConflictError("You can't delete the last role");
    }
    const deletedUserRole = await this.userRoleRepo.revokeSimpleRole({ userId, role });
    return { role: deletedUserRole, type: 'DELETED' } as const;
  };

  findByUserIdAndRole = async ({ userId, role }: { userId: string; role: UserRoleSimple }) => {
    const userRole = await this.userRoleRepo.findByUserIdAndRole({ userId, role });
    return userRole;
  };

  findManyById = async ({ id }: { id: string }) => {
    const userRole = await this.userRoleRepo.findManyById({ id });
    return userRole;
  };
}
