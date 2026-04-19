import { ConflictError, InternalServerError, NotFoundError } from '@/err/customErrors';
import { CustomClaims as Claims } from '@/types/auth/Claims';
import { CreateSchoolRequest } from '@repo/contracts/schemas/school/createSchoolRequest';
import { CreateSchoolWithUserRequest } from '@repo/contracts/schemas/school/createWithUser';
import { UpdateSchoolRequest } from '@repo/contracts/schemas/school/updateSchoolRequest';
import { UserService } from '../User/Service/user.service';
import { SchoolMapper } from './school.mapper';
import { SchoolService } from './school.service';
import { Role } from '@/generated/prisma/enums';
import { SchoolRepo } from './school.repo';

export class SchoolAppService {
  constructor(
    private readonly schoolService: SchoolService,
    private readonly schoolRepo: SchoolRepo,
    private readonly userService: UserService,
  ) {}

  createMySchool = async (data: CreateSchoolRequest, userId: string) => {
    const existingSchool = await this.schoolService.findByUserId(userId);

    if (existingSchool) {
      throw new ConflictError({ message: 'School already exists', internalLog: `user ${userId} already has a school` });
    }

    const school = await this.schoolService.create(data, userId);
    const schoolResponse = SchoolMapper.toResponse(school);
    return schoolResponse;
  };

  createWithUser = async (data: CreateSchoolWithUserRequest) => {
    const existingUser = await this.userService.findByEmail(data.user.email);

    if (existingUser) {
      throw new ConflictError({
        message: 'User already exists',
        internalLog: `user ${data.user.email} already exists`,
      });
    }

    const response = await this.userService.createAuthUserAndUser(data.user);
    if (!response.success) {
      if (response.cause === 'EMAIL_ALREADY_EXISTS') {
        throw new ConflictError({
          message: 'User already exists',
          internalLog: `user ${data.user.email} already exists`,
        });
      }
      // * this is not efficent, yet to fix it you need to add some logic and refactor to handle internal erros with successs true and fale etc and try to catch without throwing the erro
      throw new InternalServerError({
        message: 'Something went wrong',
        internalLog: `user ${data.user.email} creation failed`,
      });
    }
    console.log('rab om 5al9 l user :', response.user);
    const school = await this.schoolService.create(data.school, response.user.id);
    const schoolWithUserResponse = SchoolMapper.toWithUserResponse(school, response.user);
    return schoolWithUserResponse;
  };

  updateMySchool = async (data: UpdateSchoolRequest, schoolId: string, claims: Claims) => {
    const existingSchool = await this.schoolService.findByUserId(claims.id);
    if (!existingSchool) {
      throw new ConflictError({
        message: 'You do not have permission to update this school',
        internalLog: `user ${claims.id} does not have a school`,
      });
    }
    if (existingSchool.id !== schoolId && claims.role !== Role.SUPER_ADMIN) {
      throw new ConflictError({
        message: 'You do not have permission to update this school',
        internalLog: `user ${claims.id} does not have permission to update school ${schoolId}`,
      });
    }

    const school = await this.schoolService.update(data, schoolId);
    const schoolResponse = SchoolMapper.toResponse(school);
    return schoolResponse;
  };

  getByUserId = async (userId: string) => {
    const school = await this.schoolService.findByUserId(userId);
    if (!school) {
      throw new NotFoundError({ message: 'School not found' });
    }
    const schoolResponse = SchoolMapper.toResponse(school);
    return schoolResponse;
  };

  getMySchool_V2 = async (claims: Claims) => {
    const school = await this.schoolRepo.getById(claims.id, {
      electiveExams: { include: { exam: true } },
      majors: { include: { major: true } },
    });
    if (!school) {
      throw new NotFoundError({ message: 'School not found' });
    }
    const schoolResponse = SchoolMapper.toWithDetails(school);
    return schoolResponse;
  };
}
