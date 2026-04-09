import { prisma } from '@/bootstrap/db.init';
import { DatabaseError } from '@/err/customErrors';
import { SubjectEnum, TermEnum } from '@/generated/prisma/enums';
import { ExamInclude } from '@/generated/prisma/models';
import { parseCalendarDate, parseTime } from '@/utils/dayjs';
import { DefaultArgs } from '@prisma/client/runtime/client';
import { CreateExamRequest } from '@repo/contracts/schemas/exam/creatExamRequest';

export class ExamRepo {
  create = async (data: CreateExamRequest) => {
    try {
      const date = parseCalendarDate(data.date);
      const startTime = parseTime(data.startTime);
      const endTime = parseTime(data.endTime);
      return await prisma.exam.create({
        data: {
          ...data,
          date,
          startTime,
          endTime,
          ...(data.isOptional && { majorId: undefined }),
        },
      });
    } catch (error) {
      if (!(error instanceof Error)) throw error;

      throw new DatabaseError({
        message: 'Operation Failed',
        clientMessage: 'Failed to create exam',
        cause: error,
      });
    }
  };

  findBySubjectAndTermAndMajor = async <T extends ExamInclude<DefaultArgs>>({
    data,
    include,
  }: {
    data: { subject: SubjectEnum; term: TermEnum; majorId: string };
    include: T;
  }) => {
    try {
      return await prisma.exam.findUnique({
        where: {
          majorId_subject_term: {
            subject: data.subject,
            term: data.term,
            majorId: data.majorId,
          },
        },
        include,
      });
    } catch (error) {
      if (!(error instanceof Error)) throw error;

      throw new DatabaseError({
        message: 'Operation Failed',
        clientMessage: 'Failed to find exam',
        cause: error,
      });
    }
  };

  findElectiveExam = async <T extends ExamInclude<DefaultArgs>>({
    data,
    include,
  }: {
    data: { subject: SubjectEnum };
    include: T;
  }) => {
    try {
      return await prisma.exam.findFirst({
        where: {
          isOptional: true,
          term: TermEnum.PRINCIPAL,
          subject: data.subject,
        },
        include,
      });
    } catch (error) {
      if (!(error instanceof Error)) throw error;

      throw new DatabaseError({
        message: 'Operation Failed',
        clientMessage: 'Failed to find exam',
        cause: error,
      });
    }
  };

  findById = async <T extends ExamInclude<DefaultArgs>>({ id, include }: { id: string; include: T }) => {
    try {
      return await prisma.exam.findUnique({
        where: { id },
        include,
      });
    } catch (error) {
      if (!(error instanceof Error)) throw error;

      throw new DatabaseError({
        message: 'Operation Failed',
        clientMessage: 'Failed to find exam',
        cause: error,
      });
    }
  };

  findByMajorId = async <T extends ExamInclude<DefaultArgs>>({ majorId, include }: { majorId: string; include: T }) => {
    try {
      return await prisma.exam.findMany({
        where: { majorId },
        include,
      });
    } catch (error) {
      if (!(error instanceof Error)) throw error;

      throw new DatabaseError({
        message: 'Operation Failed',
        clientMessage: 'Failed to find exam',
        cause: error,
      });
    }
  };

  findAllElectiveExams = async <T extends ExamInclude<DefaultArgs>>({ include }: { include: T }) => {
    try {
      return await prisma.exam.findMany({
        where: { isOptional: true },
        include,
      });
    } catch (error) {
      if (!(error instanceof Error)) throw error;

      throw new DatabaseError({
        message: 'Operation Failed',
        clientMessage: 'Failed to find exams',
        cause: error,
      });
    }
  };
}
