import { prisma } from '@/bootstrap/db.init';
import { RepoError_V2 } from '@/err/repo/DbError.v2';
import { TX } from '@/types/prisma/PrismaTransaction';
import { CreateSubjectRequest } from '@repo/contracts/schemas/subject/createSubjectRequest';
import { UpdateSubjectRequest } from '@repo/contracts/schemas/subject/updateSubjectRequest';

export class SubjectRepo {
  create = async (params: { schoolId: string; subject: CreateSubjectRequest }, tx?: TX) => {
    const { subject, schoolId } = params;
    const client = tx ?? prisma;
    try {
      const createdSubject = await client.subject.create({
        data: {
          name_en: subject.name.en,
          name_fr: subject.name.fr,
          name_ar: subject.name.ar,
          grade: subject.grade,
          hoursPerWeek: subject.hoursPerWeek,
          domain: subject.domain,
          schoolId,
        },
      });
      return createdSubject;
    } catch (error) {
      throw RepoError_V2.handleRepoError(error);
    }
  };

  update = async (params: { schoolId: string; subjectId: string; subject: UpdateSubjectRequest }, tx?: TX) => {
    const { subject, subjectId, schoolId } = params;
    const client = tx ?? prisma;
    try {
      const updatedSubject = await client.subject.update({
        where: {
          id: subjectId,
          schoolId,
        },
        data: {
          name_en: subject.name.en,
          name_fr: subject.name.fr,
          name_ar: subject.name.ar,
          grade: subject.grade,
          hoursPerWeek: subject.hoursPerWeek,
          domain: subject.domain,
        },
      });
      return updatedSubject;
    } catch (error) {
      throw RepoError_V2.handleRepoError(error);
    }
  };

  find = async (params: { subjectId: string; schoolId: string }, tx?: TX) => {
    const { subjectId, schoolId } = params;
    const client = tx ?? prisma;
    try {
      const subject = await client.subject.findUnique({
        where: {
          id: subjectId,
          schoolId,
        },
      });
      return subject;
    } catch (error) {
      throw RepoError_V2.handleRepoError(error);
    }
  };

  findAll = async (params: { schoolId: string }, tx?: TX) => {
    const { schoolId } = params;
    const client = tx ?? prisma;
    try {
      const subjects = await client.subject.findMany({
        where: {
          schoolId,
        },
      });
      return subjects;
    } catch (error) {
      throw RepoError_V2.handleRepoError(error);
    }
  };
}
