import { prisma } from '@/bootstrap/db.init';
import { Prisma } from '@/generated/prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/client';
import { CreateSchoolRequest } from '@repo/contracts/schemas/school/createSchoolRequest';
import { UpdateSchoolRequest } from '@repo/contracts/schemas/school/updateSchoolRequest';

export class SchoolRepo {
  create = async <T extends Prisma.SchoolInclude<DefaultArgs>>(
    data: CreateSchoolRequest,
    userId: string,
    options?: { include: T },
  ) => {
    return await prisma.school.create({
      data: { ...data, userId },
      include: options?.include,
    });
  };

  getByUserId = async (userId: string) => {
    return await prisma.school.findUnique({
      where: { userId },
    });
  };

  update = async (data: UpdateSchoolRequest, schoolId: string) => {
    return await prisma.school.update({
      where: { id: schoolId },
      data,
    });
  };

  getById = async (schoolId: string) => {
    return await prisma.school.findUnique({
      where: { id: schoolId },
    });
  };
}
