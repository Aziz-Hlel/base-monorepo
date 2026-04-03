import { CreateSchoolRequest } from '@repo/contracts/schemas/school/createSchoolRequest';
import { CreateSchoolPayload } from './types/createSchoolPayload';
import { SchoolPlan } from '@/generated/prisma/enums';

export class SchoolMapper {
  static toCreateSchoolPayload = ({
    schema,
    accountId,
    slug,
  }: {
    schema: CreateSchoolRequest;
    accountId: string;
    slug: string;
  }): CreateSchoolPayload => {
    return {
      ...schema,
      ownerId: accountId,
      slug,
      plan: SchoolPlan.FREE,
    };
  };
}
