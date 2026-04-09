import { BadRequestError } from '@/err/customErrors';
import { isElectiveExamEnum } from '@repo/contracts/schemas/ElectiveExam/utils';
import { ElectiveExamRepo } from './electiveExam.repo';

export class ElectiveExamService {
  constructor(private readonly electiveExamRepo: ElectiveExamRepo) {}

  create = async ({ name }: { name: string }) => {
    if (!isElectiveExamEnum(name))
      throw new BadRequestError({
        message: 'Invalid elective exam name',
        clientMessage: 'Invalid elective exam name',
      });
    const createdElectiveExam = await this.electiveExamRepo.create({ name });
    return createdElectiveExam;
  };
}
