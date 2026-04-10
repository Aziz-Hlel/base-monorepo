import { Role } from '@/generated/prisma/enums';

export const superAdminData = [
  {
    email: 'tigana137@gmail.com',
    password: '12345678',
    role: Role.SUPER_ADMIN,
  },
  {
    email: 'm.aziz.hlel@gmail.com',
    password: '12345678',
    role: Role.SUPER_ADMIN,
  },
];

export const userData = [
  {
    email: 'user@gmail.com',
    password: '12345678',
    role: Role.ADMIN,
  },
];
