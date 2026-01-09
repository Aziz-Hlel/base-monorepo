import { UserPageQuery } from '@contracts/schemas/user/UserPageQuery';
import crypto from 'crypto';

const stableHash = (value: unknown): string => {
  return crypto.createHash('sha1').update(JSON.stringify(value)).digest('hex');
};

const normalizeEnumArray = <T extends string>(values: readonly T[]): string | null => {
  if (values.length === 0) return null;
  return [...new Set(values)].sort().join(',');
};

export const RedisKeys = {
  user: (userId: string) => `user:${userId}`,

  usersPage: {
    pattern: () => 'users:list:*',
    genKey: ({ page, size, order, sort, search, role, status }: UserPageQuery) =>
      [
        'users:list',
        `page=${page}`,
        `size=${size}`,
        `order=${order}`,
        `sort=${sort}`,
        search ? `search=${search}` : null,
        role ? `role=${role}` : null,
        status ? `status=${status}` : null,
      ]
        .filter(Boolean)
        .join(':'),
  },
};
