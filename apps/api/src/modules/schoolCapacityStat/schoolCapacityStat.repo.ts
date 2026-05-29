import { prisma } from '@/bootstrap/db.init';
import { CapacityTypeEnum } from '@/generated/prisma/enums';
import { CreateSchoolCapStatRequest } from '@repo/contracts/src/schemas/schoolCapacityStats/createSchoolCapStatRequest';
import { TX } from '@/types/prisma/PrismaTransaction';

export class SchoolCapacityStatRepo {
  createMany = async (params: { schoolId: string; input: CreateSchoolCapStatRequest[] }, tx?: TX) => {
    const { schoolId, input } = params;

    const client = tx || prisma;

    return await client.schoolCapacityStats.createMany({
      data: input.map((stat) => ({
        schoolId,
        majorId: stat.type === CapacityTypeEnum.MAJOR ? stat.majorId : null,
        examId: stat.type === CapacityTypeEnum.ELECTIVE ? stat.examId : null,
        nbrClasses: stat.nbrClasses,
        type: stat.type,
      })),
    });
  };

  deleteMany = async (params: { schoolId: string; input: CreateSchoolCapStatRequest[] }, tx?: TX) => {
    const { schoolId, input } = params;

    const client = tx || prisma;

    return await client.schoolCapacityStats.deleteMany({
      where: {
        schoolId,
      },
    });
  };

  upsertMany = async (params: { schoolId: string; input: CreateSchoolCapStatRequest }, tx?: TX) => {
    const { schoolId, input } = params;

    const client = tx || prisma;

    return await client.schoolCapacityStats.upsert({
      where: {
        schoolId_examId: input.type === CapacityTypeEnum.ELECTIVE ? { schoolId, examId: input.examId } : undefined,
        schoolId_majorId: input.type === CapacityTypeEnum.MAJOR ? { schoolId, majorId: input.majorId } : undefined,
      },
      update: {
        nbrClasses: input.nbrClasses,
      },
      create: {
        schoolId,
        majorId: input.type === CapacityTypeEnum.MAJOR ? input.majorId : null,
        examId: input.type === CapacityTypeEnum.ELECTIVE ? input.examId : null,
        nbrClasses: input.nbrClasses,
        type: input.type,
      },
    });
  };
}
