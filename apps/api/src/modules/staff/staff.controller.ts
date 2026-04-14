import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import getParam from '@/utils/getParam';
import { createStaffRequestSchema } from '@repo/contracts/schemas/staff/createStaffRequest';
import { Response } from 'express';
import { CreateSimpleUserUseCase } from '../User/use-cases/createSimpleUser.use-case';

export class StaffController {
  constructor(private readonly createSimpleUserUseCase: CreateSimpleUserUseCase) {}

  create = async (req: AuthenticatedRequest, res: Response) => {
    const input = createStaffRequestSchema.parse(req.body);
    const schoolId = getParam(req, 'schoolId', { uuid: true });
    const result = await this.createSimpleUserUseCase.execute({ input, schoolId });
    res.status(201).json({
      message: 'Staff created successfully',
      staff: { id: result.user.id },
      accountExists: result.isAccountExist,
    });
  };
}
