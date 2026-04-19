import { prisma } from '@/bootstrap/db.init';
import { ConflictError, NotFoundError } from '@/err/customErrors';
import { Prisma } from '@/generated/prisma/client';
import { ExamRepo } from '@/modules/Exam/exam.repo';
import { ExamSessionRepo } from '../examSession.repo';

export class AssignElectiveExamToClassUseCase {
  constructor(
    private readonly examSessionRepo: ExamSessionRepo,
    private readonly examRepo: ExamRepo,
  ) {}

  execute = async (params: { classId: string; electiveExamId: string }) => {
    const { classId, electiveExamId } = params;

    return await prisma.$transaction(async (tx) => {
      const electiveExam = await this.examRepo.findElectiveExamByIdAndCurrentTerm({ id: electiveExamId }, {});
      if (!electiveExam) throw new NotFoundError('Elective exam not found');
      const currentExamSession = await this.examSessionRepo.findByClassIdAndElectiveExamIdAndTime({
        classId,
        electiveExamId,
        timeOfDay: electiveExam.timeOfDay,
        startTime: electiveExam.startTime,
        endTime: electiveExam.endTime,
      });

      const previousExamSessionCount = currentExamSession
        ? await this.examSessionRepo.delete({ id: currentExamSession.id })
        : 0;
      try {
        const newExamSessionCount = await this.examSessionRepo.create({
          classId,
          examId: electiveExamId,
        });
        return { previousExamSessionCount, newExamSessionCount };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ConflictError('Exam session already exists');
          }
        }
        throw error;
      }
    });
  };
}
