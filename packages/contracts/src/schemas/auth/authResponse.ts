import { UserRole } from '../../types/enums/enums';
import type { AccountResponse } from '../account/accountResponse';

type StudentResponse = {
  id: string;
  firstName: string;
  lastName: string;
};

type SchoolResponse = {
  id: string;
  slug: string;
  names: {
    en: string;
    fr: string;
    ar: string;
  };
};

export type AuthResponse = {
  users: {
    id: string;
    firstName: string;
    lastName: string;
    roles: UserRole[];
    children: StudentResponse[];
    school: SchoolResponse;
    teacher: {
      id: string;
    } | null;
    parent: {
      id: string;
    } | null;
  }[];
} & AccountResponse;

export const schoolWorkspace = {
  ADMINISTRATION: 'ADMINISTRATION',
  PARENT: 'PARENT',
  TEACHER: 'TEACHER',
} as const;

export type SchoolWorkspace = (typeof schoolWorkspace)[keyof typeof schoolWorkspace];

export const administrationRoles = [
  UserRole.DIRECTOR,
  UserRole.MANAGER,
  UserRole.NURSE,
  UserRole.DRIVER,
] as const satisfies readonly UserRole[];

export const administrationRolesSet = new Set(administrationRoles);

export type AdministrationRole = (typeof administrationRoles)[number];

export type AdministrationWorkspace =
  | {
      id: string;
      firstName: string;
      lastName: string;
      school: SchoolResponse & {
        role: AdministrationRole;
      };
    }
  | {
      id: string;
      firstName: string;
      lastName: string;
      school:
        | (SchoolResponse & {
            role: 'OWNER';
          })
        | null;
    };

export type TeacherWorkspace = {
  id: string;
  firstName: string;
  lastName: string;
  school: SchoolResponse;
};

export type ParentWorkspace = {
  id: string;
  firstName: string;
  lastName: string;
  student: StudentResponse;
};

export type AuthResponse2 = AccountResponse & {
  administration: AdministrationWorkspace[];
  teacher: TeacherWorkspace[];
  parent: ParentWorkspace[];
};
