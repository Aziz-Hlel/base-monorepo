import { AssignExamToClassesRequest } from '@repo/contracts/schemas/examSession/assignExamToClassesRequest';
import { ExamSessionRepo } from '../examSession.repo';
import { ClassRepo } from '@/modules/class/class.repo';

export class AssignExamToClassesUseCase {
  constructor(
    private readonly classRepo: ClassRepo,
    private readonly examSessionRepo: ExamSessionRepo,
  ) {}

  async execute(data: AssignExamToClassesRequest) {
    const { classIds, examId } = data;
    const classIdSet = new Set(classIds);
    const duplicateIdsNbr = classIds.length - classIdSet.size;
    const classes = await this.classRepo.findMany(classIds);
    const invalidIds = classIdSet.size - classes.length;

    const validClassIds = classes.map((c) => c.id);
    const resultCount = await this.examSessionRepo.createManyByExamIdAndClassIds({
      examId,
      classIds: validClassIds,
    });

    return {
      duplicatesInPayload: duplicateIdsNbr,
      invalidIds,
      createdCount: resultCount,
      existingRecords: validClassIds.length - resultCount,
    };
  }
}
