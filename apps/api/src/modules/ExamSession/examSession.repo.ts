import { prisma } from '@/bootstrap/db.init';
import { TermEnum, TimeOfDayEnum } from '@/generated/prisma/enums';
import { TX } from '@/types/prisma/PrismaTransaction';
import { parseTime } from '@/utils/dayjs';
import { getCurrentTerm } from '@/utils/getCurrentTerm';

export class ExamSessionRepo {
  create = async (params: { classId: string; examId: string }, tx?: TX) => {
    const client = tx ?? prisma;
    const { classId, examId } = params;
    const examSession = await client.examSession.create({
      data: {
        classId,
        examId,
      },
    });
    return examSession;
  };

  createManyByClassIdAndExamIds = async (params: { classId: string; examIds: string[] }, tx?: TX) => {
    const client = tx ?? prisma;
    const { classId, examIds } = params;
    const examSessions = await client.examSession.createMany({
      data: examIds.map((examId) => ({
        classId,
        examId,
      })),
      skipDuplicates: true,
    });
    return examSessions.count;
  };

  createManyByExamIdAndClassIds = async (params: { examId: string; classIds: string[] }, tx?: TX) => {
    const client = tx ?? prisma;
    const { examId, classIds } = params;
    const examSessions = await client.examSession.createMany({
      data: classIds.map((classId) => ({
        classId,
        examId,
      })),
      skipDuplicates: true,
    });
    return examSessions.count;
  };

  deleteAssignedMajorExamToClass = async (params: { majorId: string; classId: string }, tx?: TX) => {
    const client = tx ?? prisma;
    const examSessions = await client.examSession.deleteMany({
      where: {
        classId: params.classId,
        exam: {
          majorId: params.majorId,
        },
      },
    });

    return examSessions.count;
  };

  deleteManyByClassIdAndExamIds = async (params: { classId: string; examIds: string[] }, tx?: TX) => {
    const client = tx ?? prisma;
    const { classId, examIds } = params;
    if (!examIds.length) return 0;
    const uniqueExamIds = [...new Set(examIds)];

    const examSessions = await client.examSession.deleteMany({
      where: {
        classId,
        examId: {
          in: uniqueExamIds,
        },
      },
    });
    return examSessions.count;
  };

  delete = async (params: { id: string }, tx?: TX) => {
    const client = tx ?? prisma;
    const { id } = params;
    const examSession = await client.examSession.deleteMany({
      where: {
        id,
      },
    });
    return examSession.count;
  };

  deleteByClassIdAndExamId = async (params: { classId: string; examId: string }, tx?: TX) => {
    const client = tx ?? prisma;
    const { classId, examId } = params;
    const examSession = await client.examSession.deleteMany({
      where: {
        classId,
        examId,
      },
    });
    return examSession.count;
  };

  deleteManyByClassIdAndTermAndIsOptional = async (
    params: { classId: string; term: TermEnum; isOptional: boolean },
    tx?: TX,
  ) => {
    const client = tx ?? prisma;
    const { classId, term, isOptional } = params;
    const examSessions = await client.examSession.deleteMany({
      where: {
        classId,
        exam: {
          term,
          isOptional,
        },
      },
    });
    return examSessions.count;
  };

  findByClassIdAndElectiveExamIdAndTime = async (
    params: { classId: string; electiveExamId: string; timeOfDay: TimeOfDayEnum; startTime: Date; endTime: Date },
    tx?: TX,
  ) => {
    const client = tx ?? prisma;
    const { classId, electiveExamId, timeOfDay, startTime, endTime } = params;
    const examSession = await client.examSession.findFirst({
      where: {
        classId,
        examId: electiveExamId,
        exam: {
          timeOfDay,
          isOptional: true,
          term: getCurrentTerm(),
          startTime: { lte: endTime },
          endTime: { gte: startTime },
        },
      },
    });
    return examSession;
  };

  deleteManyByExamIds = async (params: { schoolId: string; examIds: string[] }, tx?: TX) => {
    const client = tx ?? prisma;
    const { schoolId, examIds } = params;
    if (!examIds.length) return 0;
    const uniqueExamIds = [...new Set(examIds)];

    const examSessions = await client.examSession.deleteMany({
      where: {
        examId: {
          in: uniqueExamIds,
        },
        class: {
          schoolId,
        },
        exam: {
          term: getCurrentTerm(),
        },
      },
    });
    return examSessions.count;
  };
}
