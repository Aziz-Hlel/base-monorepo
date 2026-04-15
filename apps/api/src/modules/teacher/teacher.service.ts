import { ConflictError, NotFoundError } from '@/err/customErrors';
import { Prisma } from '@/generated/prisma/client';
import { UpdateTeacherRequest } from '@repo/contracts/schemas/teacher/updateTeacherRequest';
import { UserService } from '../User/user.service';
import { TeacherMapper } from './teacher.mapper';
import { TeacherRepo } from './teacher.repo';

export class TeacherService {
  constructor(
    private readonly teacherRepo: TeacherRepo,
    private readonly userService: UserService,
  ) {}

  create = async ({ userId }: { userId: string }, tx?: Prisma.TransactionClient) => {
    const existingTeacher = await this.teacherRepo.findByUserId({ userId });
    if (existingTeacher) {
      throw new ConflictError({
        message: 'Teacher already exists',
        internalLog: `Teacher with userId ${userId} already exists`,
      });
    }
    const createdTeacher = await this.teacherRepo.create({ userId }, tx);

    return createdTeacher;
  };

  findByUserId = async ({ userId }: { userId: string }) => {
    const teacher = await this.teacherRepo.findByUserId(
      { userId },
      { include: { user: { include: { account: { include: { avatar: true } } } } } },
    );
    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    const teacherResponse = TeacherMapper.toResponse(teacher);
    return teacherResponse;
  };

  getById = async (teacherId: string, schoolId: string) => {
    const teacher = await this.teacherRepo.findById(
      { id: teacherId },
      { include: { user: { include: { account: { include: { avatar: true } } } } } },
    );
    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }
    if (teacher.user.schoolId !== schoolId) {
      throw new NotFoundError('Teacher not found');
    }

    const teacherResponse = TeacherMapper.toResponse(teacher);
    return teacherResponse;
  };

  update = async ({
    input,
    teacherId,
    schoolId,
  }: {
    input: UpdateTeacherRequest;
    teacherId: string;
    schoolId: string;
  }) => {
    const existingTeacher = await this.teacherRepo.findById(
      { id: teacherId },
      { include: { user: { select: { id: true, schoolId: true } } } },
    );

    if (!existingTeacher) {
      throw new NotFoundError('Teacher not found');
    }
    if (existingTeacher.user.schoolId !== schoolId) {
      throw new NotFoundError({
        message: 'Teacher not found',
        internalLog: `Teacher with id ${teacherId} exists but not in school ${schoolId}`,
      });
    }

    const updatedUser = await this.userService.updateSimpleUser({
      input,
      userId: existingTeacher.user.id,
      schoolId,
    }); // ? All Teacher fields to be updated are in user table
    return {
      id: existingTeacher.id,
      user: updatedUser,
    };
  };
}
