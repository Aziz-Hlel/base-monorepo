import { Request, Response } from 'express';
import { UpdateSchoolCapStatUseCase } from './use-case/updateSchoolCapStat.use-case';
import getUrlParam from '@/utils/getUrlParam';
import { createSchoolCapStatRequestSchema } from '@repo/contracts/schemas/schoolCapacityStats/createSchoolCapStatRequest';

export class SchoolCapacityStatController {
  constructor(private readonly updateSchoolCapStatUseCase: UpdateSchoolCapStatUseCase) {}

  update = async (request: Request, responde: Response) => {
    const schoolId = getUrlParam(request, 'schoolId', { isUuid: true });
    const input = createSchoolCapStatRequestSchema.array().parse(request.body);

    const response = await this.updateSchoolCapStatUseCase.execute({ schoolId, input });
    responde.status(200).json({
      message: 'School capacity stat updated successfully',
      data: response,
    });
  };
}
