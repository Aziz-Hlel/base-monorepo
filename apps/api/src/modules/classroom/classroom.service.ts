import { prisma } from '@/bootstrap/db.init';
import { RepoKnownErrors } from '@/err/repo/DbError';
import { PrismaErrorCode } from '@/err/repo/PrismaErrorCode';
import { ConflictError, NotFoundError } from '@/err/service/customErrors';
import { ClassGrade } from '@/generated/prisma/enums';
import { TX } from '@/types/prisma/PrismaTransaction';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { CreateClassroomRequest } from '@repo/contracts/schemas/classroom/createClassRequest';
import { UpdateClassroomRequest } from '@repo/contracts/schemas/classroom/updateClassRequest';
import { ClassroomMapper } from './classroom.mapper';
import { ClassroomRepo } from './classroom.repo';

export class ClassroomService {
  constructor(private readonly classesRepo: ClassroomRepo) {}

  createAssignmentsForClass = async (params: { classId: string; grade: ClassGrade; schoolId: string }, tx: TX) => {
    const { classId, grade, schoolId } = params;
    const subjects = await tx.subject.findMany({ where: { schoolId, grade }, select: { id: true } });

    const assignmentParams = subjects.map(({ id }) => ({
      subjectId: id,
      classroomId: classId,
      schoolId: schoolId,
      teacherId: null,
    }));

    await tx.assignment.createMany({ data: assignmentParams });
  };

  create = async (params: { input: CreateClassroomRequest; schoolId: string }) => {
    const { input, schoolId } = params;
    try {
      return await prisma.$transaction(async (tx) => {
        let createdClass;
        createdClass = await this.classesRepo.create({ input, schoolId }, tx);
        await this.createAssignmentsForClass({ classId: createdClass.id, grade: input.grade, schoolId }, tx);
        const classResponse = ClassroomMapper.toResponse(createdClass);
        return classResponse;
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === PrismaErrorCode.UNIQUE_CONSTRAINT)
        throw new ConflictError({ message: 'Class already exists', cause: error });
      throw error;
    }
  };

  update = async (params: { input: UpdateClassroomRequest; classroomId: string; schoolId: string }) => {
    const { input, classroomId, schoolId } = params;
    try {
      const updatedClass = await this.classesRepo.update({ input, classroomId, schoolId });
      const classResponse = ClassroomMapper.toResponse(updatedClass);
      return classResponse;
    } catch (error) {
      if (error instanceof RepoKnownErrors.ConflictError)
        throw new ConflictError({ message: 'Class already exists', cause: error });
      if (error instanceof RepoKnownErrors.NotFoundError)
        throw new NotFoundError({ message: 'Class not found', cause: error });
      throw error;
    }
  };

  findById = async (params: { classroomId: string; schoolId: string }) => {
    const { classroomId, schoolId } = params;
    try {
      const classUnit = await this.classesRepo.find({ classroomId, schoolId });
      if (!classUnit) {
        throw new NotFoundError('Class not found');
      }
      const classResponse = ClassroomMapper.toResponse(classUnit);
      return classResponse;
    } catch (error) {
      if (error instanceof RepoKnownErrors.NotFoundError)
        throw new NotFoundError({ message: 'Class not found', cause: error });
      throw error;
    }
  };
}
