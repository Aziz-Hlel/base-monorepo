import { CreateSchoolRequest } from '@repo/contracts/schemas/school/createSchoolRequest';
import { SchoolPlan } from '@/generated/prisma/enums';

export type CreateSchoolPayload = CreateSchoolRequest & {
  ownerId: string;
  slug: string;
  plan: SchoolPlan;
};
