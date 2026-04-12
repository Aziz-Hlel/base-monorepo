import { School, User } from '@/generated/prisma/client';
import { SchoolResponse } from '@repo/contracts/schemas/school/schoolResponse';
import { SchoolWithUserResponse } from '@repo/contracts/schemas/school/schoolWithUserResponse';
import UserMapper from '../User/mapper/user.mapper';

export class SchoolMapper {
  static toResponse(school: School): SchoolResponse {
    return {
      id: school.id,
      name: school.name,
      publicId: school.publicId,
      city: school.city,
    };
  }

  static toWithUserResponse(school: School, user: User): SchoolWithUserResponse {
    const userResponse = UserMapper.toUserResponse(user);
    return {
      ...userResponse,
      school: this.toResponse(school),
    };
  }
}
