import { DecodedIdTokenWithClaims } from '@/types/auth/DecodedTokenWithClaims';
import { SchoolRepo } from './school.repo';
import { CreateSchoolRequest } from '@repo/contracts/schemas/school/createSchoolRequest';
import { prisma } from '@/bootstrap/db.init';
import { ConflictError, ForbiddenError, NotFoundError } from '@/err/customErrors';
import { SchoolMapper } from './school.mapper';
import { UpdateSchoolRequest } from '@repo/contracts/schemas/school/updateSchoolRequest';
import { School } from '@/generated/prisma/client';
import { GetMySchoolResponse } from '@repo/contracts/schemas/school/getMySchoolResponse';

export interface ISchoolService {
  create: (params: { schema: CreateSchoolRequest; token: DecodedIdTokenWithClaims }) => Promise<School>;
  update: (params: { schema: UpdateSchoolRequest; schoolId: string; token: DecodedIdTokenWithClaims }) => Promise<void>;
  getMySchool: (params: { token: DecodedIdTokenWithClaims }) => Promise<GetMySchoolResponse>;
  getById: (params: { schoolId: string; token: DecodedIdTokenWithClaims }) => Promise<void>;
  getPage: (params: { schema: any; token: DecodedIdTokenWithClaims }) => Promise<void>;
  delete: (params: { schoolId: string; token: DecodedIdTokenWithClaims }) => Promise<void>;
}

export class SchoolService implements ISchoolService {
  constructor(private readonly schoolRepo: SchoolRepo) {}

  create = async ({ schema, token }: { schema: CreateSchoolRequest; token: DecodedIdTokenWithClaims }) => {
    return await prisma.$transaction(async (tx) => {
      const owner = await tx.owner.findUnique({
        where: {
          accountId: token.claims.accountId,
        },
        select: { id: true, school: { select: { id: true } } },
      });
      if (!owner) {
        throw new ForbiddenError('You are not allowed to create a school');
      }

      if (owner.school) {
        throw new ConflictError('Account already has a school');
      }

      const slug = schema.nameEn.toLowerCase().replace(/\s/g, '-');
      const createSchoolPayload = SchoolMapper.toCreateSchoolPayload({ schema, slug });
      const createdSchool = await this.schoolRepo.create({ payload: createSchoolPayload, ownerId: owner.id, tx });
      return createdSchool;
    });
  };

  update = async ({
    schema,
    schoolId,
    token,
  }: {
    schema: UpdateSchoolRequest;
    schoolId: string;
    token: DecodedIdTokenWithClaims;
  }) => {
    await prisma.$transaction(async (tx) => {
      const school = await tx.school.findUnique({
        where: {
          id: schoolId,
          owner: {
            accountId: token.claims.accountId,
          },
        },
      });
      if (!school) {
        //**
        // ✔ Covers ALL cases:
        // School doesn’t exist
        // Not owned by user
        // User not allowed
        // */
        throw new NotFoundError('School not found');
      }

      await this.schoolRepo.update({ payload: schema, schoolId, tx });
    });
  };

  getMySchool = async ({ token }: { token: DecodedIdTokenWithClaims }): Promise<GetMySchoolResponse> => {
    const school = await this.schoolRepo.getByAccountId({ accountId: token.claims.accountId });
    if (!school) {
      throw new NotFoundError('School not found');
    }
    const schoolResponse = SchoolMapper.toGetMySchoolResponse(school);
    return schoolResponse;
  };

  getById = async ({ schoolId, token }: { schoolId: string; token: DecodedIdTokenWithClaims }) => {
    throw new Error('Method not implemented.');
  };

  getPage = async ({ schema, token }: { schema: any; token: DecodedIdTokenWithClaims }) => {
    throw new Error('Method not implemented.');
  };

  delete = async ({ schoolId, token }: { schoolId: string; token: DecodedIdTokenWithClaims }) => {
    throw new Error('Method not implemented.');
  };
}
