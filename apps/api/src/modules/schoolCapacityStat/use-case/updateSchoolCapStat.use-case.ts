import { ExamSessionService } from '@/modules/ExamSession/examSession.service';
import { SchoolCapacityStatRepo } from '../schoolCapacityStat.repo';
import { ExamService } from '@/modules/Exam/exam.service';
import { prisma } from '@/bootstrap/db.init';
import { CreateSchoolCapStatRequest } from '@repo/contracts/schemas/schoolCapacityStats/createSchoolCapStatRequest';
import { CapacityTypeEnum } from '@/generated/prisma/enums';
import { DatabaseError } from '@/err/customErrors';

export class UpdateSchoolCapStatUseCase {
  constructor(
    private readonly schoolCapacityStatRepo: SchoolCapacityStatRepo,
    private readonly examService: ExamService,
    private readonly examSessionService: ExamSessionService,
  ) {}

  execute = async (params: { schoolId: string; input: CreateSchoolCapStatRequest[] }) => {
    const { schoolId, input } = params;

    try {
      return await prisma.$transaction(async (tx) => {
        const queries = input.map(
          async (schoolStat) => await this.schoolCapacityStatRepo.upsertMany({ schoolId, input: schoolStat }, tx),
        );

        await Promise.all(queries);

        const examIds: string[] = [];
        input
          .filter((schoolStat) => schoolStat.type === CapacityTypeEnum.MAJOR && schoolStat.nbrClasses === 0)
          .forEach(async (schoolStat) => {
            const ids =
              schoolStat.type === CapacityTypeEnum.MAJOR
                ? await this.examService.findByMajorId({ majorId: schoolStat.majorId })
                : [];

            examIds.push(...ids.map((exam) => exam.id));
          });
        await this.examSessionService.unassignByExamIds({ schoolId, examIds });
      });
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      throw new DatabaseError({ message: 'Failed to update school capacity stat', cause: error });
    }
  };
}
