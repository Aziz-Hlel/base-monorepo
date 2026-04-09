import { prisma } from '@/bootstrap/db.init';
import { DatabaseError } from '@/err/customErrors';
import { CreateElectiveExamRequest } from '@repo/contracts/schemas/ElectiveExam/createElectiveExamRequest';

export class ElectiveExamRepo {
  create = async (data: CreateElectiveExamRequest) => {
    try {
      prisma.electiveExam.create({
        data,
      });
    } catch (error) {
      if (!(error instanceof Error)) throw error;

      throw new DatabaseError({
        message: 'Operation Failed',
        clientMessage: 'Failed to create elective exam',
        cause: error,
      });
    }
  };
}
