import { prisma } from '@/bootstrap/db.init';
import { CreateTeacherRequest } from '@repo/contracts/schemas/teacher/createTeacherRequest';
import { UpdateTeacherRequest } from '@repo/contracts/schemas/teacher/updateTeacherRequest';

export class TeacherRepo {
  create = async (data: CreateTeacherRequest, schoolId: string) => {
    return await prisma.teacher.create({
      data: { ...data, schoolId },
    });
  };

  getBySchoolId = async (schoolId: string) => {
    return await prisma.teacher.findMany({
      where: { schoolId },
    });
  };

  getById = async (id: string) => {
    return await prisma.teacher.findUnique({
      where: { id },
    });
  };

  update = async (data: UpdateTeacherRequest, id: string) => {
    return await prisma.teacher.update({
      where: { id },
      data,
    });
  };

  delete = async (id: string) => {
    return await prisma.teacher.delete({
      where: { id },
    });
  };
}
