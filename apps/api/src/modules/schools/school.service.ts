import { DecodedIdTokenWithClaims } from '@/types/auth/DecodedTokenWithClaims';
import { SchoolRepo } from './school.repo';
import { CreateSchoolRequest } from '@repo/contracts/schemas/school/createSchoolRequest';
import { prisma } from '@/bootstrap/db.init';
import { ConflictError, ForbiddenError, NotFoundError } from '@/err/customErrors';
import { SchoolMapper } from './school.mapper';
import { UpdateSchoolRequest } from '@repo/contracts/schemas/school/updateSchoolRequest';

export class SchoolService {
  constructor(private readonly schoolRepo: SchoolRepo) {}

  create = async ({ schema, token }: { schema: CreateSchoolRequest; token: DecodedIdTokenWithClaims }) => {
    prisma.$transaction(async (tx) => {
      const owner = await tx.owner.findUnique({
        where: {
          accountId: token.claims.id,
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
      const createSchoolPayload = SchoolMapper.toCreateSchoolPayload({
        schema,
        accountId: token.claims.id,
        slug,
      });
      await this.schoolRepo.create({ payload: createSchoolPayload, tx });
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
    prisma.$transaction(async (tx) => {
      const school = await tx.school.findUnique({
        where: {
          id: schoolId,
          owner: {
            accountId: token.claims.id,
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
}
