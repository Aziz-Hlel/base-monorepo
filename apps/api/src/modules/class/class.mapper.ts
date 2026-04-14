import { Class } from '@/generated/prisma/client';
import { ClassResponse } from '@repo/contracts/schemas/class/classResponse';

export class ClassMapper {
  static toResponse(cls: Class): ClassResponse {
    return {
      id: cls.id,
      name: cls.name,
      createdAt: cls.createdAt.toISOString(),
      updatedAt: cls.updatedAt.toISOString(),
    };
  }
}
