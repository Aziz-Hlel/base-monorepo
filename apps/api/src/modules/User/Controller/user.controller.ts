import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import { Response } from 'express';
import { IUserService } from '../Service/user.app.service';
import { createUserRequestSchema } from '@repo/contracts/schemas/user2/createUserRequest';
import getParam from '@/utils/getParam';

export class UserController {
  constructor(private readonly userService: IUserService) {}

  create = async (req: AuthenticatedRequest, res: Response) => {
    const schoolId = getParam(req, 'schoolId', { uuid: true });
    const schema = createUserRequestSchema.parse(req.body);
    const result = await this.userService.createUser({ payload: schema, schoolId });
    res.status(201).json(result);
  };
}
