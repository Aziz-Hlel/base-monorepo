import { CreateSchoolRequest } from '@repo/contracts/schemas/school/createSchoolRequest';
import { SchoolPlan } from '@/generated/prisma/enums';

export type CreateSchoolPayload = CreateSchoolRequest & {
  slug: string;
  plan: SchoolPlan;
};
