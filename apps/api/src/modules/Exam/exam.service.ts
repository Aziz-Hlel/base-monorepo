import { CreateExamRequest } from '@repo/contracts/schemas/exam/creatExamRequest';
import { ExamRepo } from './exam.repo';
import { MajorEnum, SubjectEnum, TermEnum } from '@/generated/prisma/enums';

export class ExamService {
  constructor(private readonly examRepo: ExamRepo) {}

  create = async (payload: CreateExamRequest) => {
    const createdExam = await this.examRepo.create(payload);
    return createdExam;
  };

  findOrCreate = async (payload: CreateExamRequest) => {
    const exam = payload.isOptional
      ? await this.examRepo.findElectiveExam({
          data: { subject: payload.subject },
          include: {},
        })
      : await this.examRepo.findBySubjectAndTermAndMajor({
          data: {
            subject: payload.subject,
            term: payload.term,
            majorId: payload.majorId,
          },
          include: {},
        });
    if (exam) return { exam, type: 'EXIST' };

    const createdExam = await this.create(payload);
    return { exam: createdExam, type: 'NEW' };
  };

  findBySubjectAndTermAndMajor = async (data: { subject: SubjectEnum; term: TermEnum; majorId: string }) => {
    const exam = await this.examRepo.findBySubjectAndTermAndMajor({ data, include: {} });
    return exam;
  };

  findElectiveExam = async ({ subject }: { subject: SubjectEnum }) => {
    const exam = await this.examRepo.findElectiveExam({
      data: { subject },
      include: {},
    });
    return exam;
  };

  findById = async ({ id }: { id: string }) => {
    const exam = await this.examRepo.findById({ id, include: { major: true } });
    return exam;
  };

  findByMajorId = async ({ majorId }: { majorId: string }) => {
    const exams = await this.examRepo.findByMajorId({ majorId, include: { major: true } });
    return exams;
  };

  findAllElectiveExams = async () => {
    const exams = await this.examRepo.findAllElectiveExams({ include: { major: true } });
    return exams;
  };
}
