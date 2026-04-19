import { prisma } from '@/bootstrap/db.init';
import { InternalServerError } from '@/err/customErrors';
import { ExamRepo } from '@/modules/Exam/exam.repo';
import { getCurrentTerm } from '@/utils/getCurrentTerm';
import { ExamSessionRepo } from '../examSession.repo';

export class AssignMajorExamsToClassUseCase {
  constructor(
    private readonly examSessionRepo: ExamSessionRepo,
    private readonly examRepo: ExamRepo,
  ) {}

  execute = async (params: { majorId: string; classId: string }) => {
    const { majorId, classId } = params;

    await prisma.$transaction(async (tx) => {
      try {
        await this.examSessionRepo.deleteManyByClassIdAndTermAndIsOptional(
          { classId, term: getCurrentTerm(), isOptional: false },
          tx,
        );
        const exams = await this.examRepo.findByMajorIdAndTerm({ majorId, term: getCurrentTerm() });
        const examIds = exams.map((exam) => exam.id);
        const createdSessionCount = await this.examSessionRepo.createManyByClassIdAndExamIds({ classId, examIds }, tx);
        return { createdSessionCount };
      } catch (error) {
        if (error instanceof Error)
          throw new InternalServerError({ message: 'Failed to assign major exams to class', cause: error });

        throw error;
      }
    });
  };
}
