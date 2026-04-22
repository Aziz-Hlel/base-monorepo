import { SubjectRepo } from './subject.repo';
import { CreateManySubjectRequest } from '@repo/contracts/schemas/subject/createManySubjectRequest';
import { CreateSubjectRequest } from '@repo/contracts/schemas/subject/createSubjectRequest';
import { UpdateSubjectRequest } from '@repo/contracts/schemas/subject/updateSubjectRequest';
import { SubjectMapper } from './subject.mapper';
import { ConflictError, NotFoundError } from '@/err/service/customErrors';
import { Prisma } from '@/generated/prisma/client';
import { PrismaErrorCode } from '@/err/repo/PrismaErrorCode';

export class SubjectService {
  constructor(private readonly subjectRepo: SubjectRepo) {}

  create = async (params: { schoolId: string; input: CreateSubjectRequest }) => {
    const { input, schoolId } = params;
    try {
      const createdSubject = await this.subjectRepo.create({ schoolId, subject: input });
      const subjectResponse = SubjectMapper.toResponse(createdSubject);
      return subjectResponse;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT) {
          throw new ConflictError({ message: 'Subject already exists', cause: error });
        }
      }
      throw error;
    }
  };

  createMany = async (params: { schoolId: string; input: CreateManySubjectRequest }) => {
    const { input, schoolId } = params;
    let successCount = 0;
    let failedCount = 0;
    const failedSubjects: {
      subject: CreateManySubjectRequest['subjects'][number];
      index: number;
      reason: 'CONFLICT' | 'OTHER';
    }[] = [];
    try {
      const queries = input.subjects.map(async (subject, index) => {
        try {
          const createdSubject = await this.subjectRepo.create({
            schoolId,
            subject: {
              grade: input.grade,
              ...subject,
            },
          });
          successCount++;
          return createdSubject;
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT) {
              failedSubjects.push({ subject, index, reason: 'CONFLICT' });
              failedCount++;
              return;
            }
          }
          failedSubjects.push({ subject, index, reason: 'OTHER' });
          failedCount++;
        }
      });
      await Promise.all(queries);
      return {
        successCount,
        failedCount,
        failedSubjects,
      };
    } catch (error) {
      throw error;
    }
  };

  update = async (params: { schoolId: string; subjectId: string; input: UpdateSubjectRequest }) => {
    const { input, subjectId, schoolId } = params;
    try {
      const updatedSubject = await this.subjectRepo.update({ schoolId, subjectId, subject: input });
      const subjectResponse = SubjectMapper.toResponse(updatedSubject);
      return subjectResponse;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT) {
          throw new ConflictError({ message: 'Subject already exists', cause: error });
        }
      }
      throw error;
    }
  };

  find = async (params: { subjectId: string; schoolId: string }) => {
    const { subjectId, schoolId } = params;
    try {
      const subject = await this.subjectRepo.find({ subjectId, schoolId });
      if (!subject) throw new NotFoundError('Subject not found');
      const subjectResponse = SubjectMapper.toResponse(subject);
      return subjectResponse;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCode.NOT_FOUND) {
          throw new NotFoundError({ message: 'Subject not found', cause: error });
        }
      }
      throw error;
    }
  };

  findAll = async (params: { schoolId: string }) => {
    const { schoolId } = params;
    const subjects = await this.subjectRepo.findAll({ schoolId });
    const subjectResponses = subjects.map((subject) => SubjectMapper.toResponse(subject));
    return subjectResponses;
  };
}
