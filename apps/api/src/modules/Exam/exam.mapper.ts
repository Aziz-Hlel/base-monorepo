import { Exam, Major } from '@/generated/prisma/client';
import { toCalendarDate, toTime } from '@/utils/dayjs';
import { ExamResponse } from '@repo/contracts/schemas/exam/examResponse';
import { MajorMapper } from '../major/major.mapper';
import { ExamWithMajorResponse } from '@repo/contracts/schemas/exam/examWithMajorResponse';

export class ExamMapper {
  static toResponse(exam: Exam): ExamResponse {
    return {
      id: exam.id,
      subject: exam.subject,
      term: exam.term,
      date: toCalendarDate(exam.date),
      startTime: toTime(exam.startTime),
      endTime: toTime(exam.endTime),
      isOptional: exam.isOptional,
      createdAt: exam.createdAt.toISOString(),
      updatedAt: exam.updatedAt.toISOString(),
    };
  }

  static toResponseWithMajor(exam: Exam & { major: Major | null }): ExamWithMajorResponse {
    const major = exam.major ? MajorMapper.toMajorResponse(exam.major) : null;
    const examResponse = ExamMapper.toResponse(exam);
    return {
      ...examResponse,
      major,
    };
  }
}
