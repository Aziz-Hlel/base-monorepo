import { School, Teacher } from '@/generated/prisma/client';
import { SchoolResponse } from '@repo/contracts/schemas/school/schoolResponse';
import { TeacherResponse } from '@repo/contracts/schemas/teacher/teacherResponse';

export class TeacherMapper {
  static toResponse(teacher: Teacher): TeacherResponse {
    return {
      id: teacher.id,
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      isTeacher: teacher.isTeacher,
      subject: teacher.subject,
      publicId: teacher.publicId,
      schoolId: teacher.schoolId,
      createdAt: teacher.createdAt.toISOString(),
      updatedAt: teacher.updatedAt.toISOString(),
    };
  }
}
