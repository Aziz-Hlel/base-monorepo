import { AccountRole, UserRole } from '@/generated/prisma/enums';
import { UserRoleSimple } from '@repo/contracts/types/enums/meta/userRoleMeta';

type SeedTenantData = {
  account: {
    email: string;
    role: 'ADMIN';
  };
  owner: {};
  school: {
    name: string;
  };
  users: {
    simpleUsers: {
      email: string;
      role: UserRoleSimple;
    }[];
  };
};

const tenant1: SeedTenantData = {
  account: {
    email: 'tigana137@gmail.com',
    role: AccountRole.ADMIN,
  },
  owner: {},
  school: {
    name: 'School 1',
  },
  users: {
    simpleUsers: [
      {
        email: 'fake-director-1@gmail.com',
        role: UserRole.DIRECTOR,
      },
      {
        email: 'fake-director-2@gmail.com',
        role: UserRole.DIRECTOR,
      },
      {
        email: 'fake-manager-1@gmail.com',
        role: UserRole.MANAGER,
      },
      {
        email: 'fake-manager-2@gmail.com',
        role: UserRole.MANAGER,
      },
      {
        email: 'fake-nurse-1@gmail.com',
        role: UserRole.NURSE,
      },
      {
        email: 'fake-nurse-2@gmail.com',
        role: UserRole.NURSE,
      },
      {
        email: 'fake-driver-1@gmail.com',
        role: UserRole.DRIVER,
      },
      {
        email: 'fake-driver-2@gmail.com',
        role: UserRole.DRIVER,
      },
    ],
  },
} as const;

export const data = [tenant1];
