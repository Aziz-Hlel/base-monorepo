import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import { Response } from 'express';
import getParam from '@/utils/getParam';
import { UserAppService } from './user.app.service';
import { createUserRequestSchema } from '@repo/contracts/schemas/user/createUserRequest';

export class UserController {
  constructor(private readonly userService: UserAppService) {}

  create = async (req: AuthenticatedRequest, res: Response) => {
    const schoolId = getParam(req, 'schoolId', { uuid: true });
    const schema = createUserRequestSchema.parse(req.body);
    const result = await this.userService.createUser({ payload: schema, schoolId });
    res.status(201).json(result);
  };

  getById = async (req: AuthenticatedRequest, res: Response) => {
    // * check if user is authorized to get this user (either owner or qualified roles but not parent for example or outside school except superadmin maybe)
    // ! you need to add parent response and teacher response etc
    const userId = getParam(req, 'userId', { uuid: true });
    const result = await this.userService.getById({ userId, schoolId: getParam(req, 'schoolId', { uuid: true }) });
    res.status(200).json(result);
  };

  update = async (req: AuthenticatedRequest, res: Response) => {
    // * not sure if you gone implment this cuz you ll propebly have separate endpoints for updating specific user based on role like parent or teacher , but again the client could call this endpoint to edit a simple user
    throw new Error('Not implemented yet');
  };
}
