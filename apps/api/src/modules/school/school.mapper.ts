import { School, User } from '@/generated/prisma/client';
import { SchoolResponse } from '@repo/contracts/schemas/school/schoolResponse';
import { SchoolWithUserResponse } from '@repo/contracts/schemas/school/schoolWithUserResponse';
import UserMapper from '../User/mapper/user.mapper';
import { SchoolGetPayload } from '@/generated/prisma/models';
import { SchoolResponseWithDetails } from '@repo/contracts/schemas/school/SchoolResponseWithDetails';
import { ElectiveExamEnum_V2 } from '@repo/contracts/types/enums/meta/selectiveExamsEnum';

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

  static toWithDetails(
    school: SchoolGetPayload<{
      include: { electiveExams: { include: { exam: true } }; majors: { include: { major: true } } };
    }>,
  ): SchoolResponseWithDetails {
    return {
      ...this.toResponse(school),
      majors: school.majors.map((major) => ({
        id: major.id,
        name: major.major.name,
        nbrClasses: major.nbrClasses,
      })),
      electiveExams: school.electiveExams.map((electiveExam) => ({
        id: electiveExam.id,
        name: electiveExam.exam.subject as ElectiveExamEnum_V2,
        nbrClasses: electiveExam.nbrClasses,
      })),
    };
  }
}
