import { Prisma } from '@/generated/prisma/client';

export type MappedPrismaError = {
  name: 'CONFLICT' | 'NOT_FOUND' | 'UNHANDLED_PRISMA_ERROR';
};

export class PrismaErrorMapper {
  static map = (error: Prisma.PrismaClientKnownRequestError) => {
    switch (error.code) {
      case 'P2002':
        return {
          name: 'CONFLICT',
        };
      case 'P2025':
        return {
          name: 'NOT_FOUND',
        };
      default:
        return {
          name: 'UNHANDLED_PRISMA_ERROR',
        };
    }
  };
}
