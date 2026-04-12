import { CreateTeacherRequest } from '@repo/contracts/schemas/teacher/createTeacherRequest';
import { UpdateTeacherRequest } from '@repo/contracts/schemas/teacher/updateTeacherRequest';
import { TeacherService } from './teacher.service';
import { SchoolService } from '../school/school.service';
import { NotFoundError, PermissionDeniedError } from '@/err/customErrors';
import { CustomClaims as Claims } from '@/types/auth/CustomClaims';
import { Role } from '@/generated/prisma/enums';
import { TeacherMapper } from './teacher.mapper';

export class TeacherAppService {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly schoolService: SchoolService,
  ) {}

  create = async (data: CreateTeacherRequest, schoolId: string, claims: Claims) => {
    const school = await this.schoolService.findById(schoolId);
    if (!school) {
      throw new NotFoundError({ message: 'School not found', internalLog: 'School not found for user ' + schoolId });
    }
    const isAllowToCreate = claims.role === Role.SUPER_ADMIN || school.userId === claims.id;
    if (!isAllowToCreate) {
      throw new PermissionDeniedError({
        message: 'You are not authorized to perform this action',
        internalLog: { claims, school },
      });
    }
    const teacher = await this.teacherService.create(data, school.id);
    const teacherRepsonse = TeacherMapper.toResponse(teacher);
    return teacherRepsonse;
  };

  getById = async (id: string, schoolId: string, claims: Claims) => {
    const isSuperAdmin = claims.role === Role.SUPER_ADMIN;
    const school = await this.schoolService.findById(schoolId);
    if (!school && !isSuperAdmin) {
      throw new PermissionDeniedError({
        message: 'You are not authorized to perform this action',
        internalLog: 'School not found for user ' + claims.id,
      });
    }
    const teacher = await this.teacherService.getById(id);
    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    const isTeacherInSchool = teacher.schoolId === school?.id;

    if (!isTeacherInSchool && !isSuperAdmin) {
      throw new PermissionDeniedError({
        message: 'You are not authorized to perform this action',
        internalLog: 'Teacher does not belong to the school of the user ' + claims.id,
      });
    }
    const teacherResponse = TeacherMapper.toResponse(teacher);
    return teacherResponse;
  };

  update = async (data: UpdateTeacherRequest, schoolId: string, teacherId: string, claims: Claims) => {
    const isSuperAdmin = claims.role === Role.SUPER_ADMIN;
    const school = await this.schoolService.findById(schoolId);
    if (!school) {
      throw new NotFoundError('School not found');
    }
    const isAllowToUpdate = claims.role === Role.SUPER_ADMIN || school.userId === claims.id;
    if (!isAllowToUpdate) {
      throw new PermissionDeniedError({
        message: 'You are not authorized to perform this action',
        internalLog: { claims, school },
      });
    }
    const teacher = await this.teacherService.getById(teacherId);
    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    const isTeacherInSchool = teacher.schoolId === school?.id;

    if (!isTeacherInSchool && !isSuperAdmin) {
      throw new PermissionDeniedError({
        message: 'You are not authorized to perform this action',
        internalLog: 'Teacher does not belong to the school of the user ' + claims.id,
      });
    }
    const updatedTeacher = await this.teacherService.update(data, teacherId);
    const teacherResponse = TeacherMapper.toResponse(updatedTeacher);
    return teacherResponse;
  };

  delete = async (id: string) => {
    throw new Error('Not implemented');
    // return await this.teacherService.delete(id);
  };

  getBySchoolId = async (schoolId: string, claims: Claims) => {
    const isSuperAdmin = claims.role === Role.SUPER_ADMIN;
    const school = await this.schoolService.findById(schoolId);
    if (!school) {
      throw new NotFoundError('School not found');
    }
    const isAllowToGet = claims.role === Role.SUPER_ADMIN || school.userId === claims.id;
    if (!isAllowToGet) {
      throw new PermissionDeniedError({
        message: 'You are not authorized to perform this action',
        internalLog: 'School not found for user ' + claims.id,
      });
    }
    const teachers = await this.teacherService.getBySchoolId(schoolId);
    const teacherResponses = teachers.map(TeacherMapper.toResponse);
    return teacherResponses;
  };
}
