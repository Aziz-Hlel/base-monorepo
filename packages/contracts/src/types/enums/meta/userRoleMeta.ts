import { UserRole } from '../enums';

export const ROLE_METADATA = {
  [UserRole.DIRECTOR]: {
    name: 'DIRECTOR',
    hasExtendedTable: false,
  },
  [UserRole.MANAGER]: {
    name: 'MANAGER',
    hasExtendedTable: false,
  },
  [UserRole.TEACHER]: {
    name: 'TEACHER',
    hasExtendedTable: true,
  },
  [UserRole.PARENT]: {
    name: 'PARENT',
    hasExtendedTable: true,
  },
  [UserRole.NURSE]: {
    name: 'NURSE',
    hasExtendedTable: false,
  },
  [UserRole.DRIVER]: {
    name: 'DRIVER',
    hasExtendedTable: false,
  },
} as const satisfies Record<UserRole, { name: UserRole; hasExtendedTable: boolean }>;

const simpleUserRolesObjects = Object.values(ROLE_METADATA).filter((role) => !role.hasExtendedTable);

export const simpleUserRoles = simpleUserRolesObjects.map((role) => role.name);

export const hasExtendedTable = (role: UserRole) => {
  return ROLE_METADATA[role].hasExtendedTable;
};
