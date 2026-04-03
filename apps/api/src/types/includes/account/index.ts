import { AccountGetPayload, AccountInclude } from '@/generated/prisma/models';
import { DefaultArgs } from '@prisma/client/runtime/client';

type AccountIncludeConstraint = AccountInclude<DefaultArgs>;

export const accountInclude = {
  avatar: true,
  owner: {
    include: {
      school: true,
    },
  },
  users: {
    include: {
      roles: true,
      school: true,
      teacher: true,
      parent: {
        include: {
          students: {
            include: {
              student: true,
            },
          },
        },
      },
    },
  },
} as const satisfies AccountIncludeConstraint;

export type AccountIncludeType = typeof accountInclude;

export type AccountEntityRequest = AccountGetPayload<{ include: typeof accountInclude }>;
