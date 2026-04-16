import { Classroom } from '@/generated/prisma/client';
import { ClassResponse } from '@repo/contracts/schemas/class/classResponse';

export class ClassroomMapper {
  static toResponse = (classroom: Classroom): ClassResponse => {
    return {
      id: classroom.id,
      name: classroom.name,
      description: classroom.description,
      grade: classroom.grade,
      createdAt: classroom.createdAt.toISOString(),
      updatedAt: classroom.updatedAt.toISOString(),
    };
  };
}
