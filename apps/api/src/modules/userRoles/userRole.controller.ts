import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import getParam from '@/utils/getParam';
import { GrantSimpleRoleRequestSchema } from '@repo/contracts/schemas/userRole/grantSimpleRoleRequest';
import { Response } from 'express';
import { UserRoleAppService } from './userRole.app.service';

export class UserRoleController {
  constructor(private readonly userRoleAppService: UserRoleAppService) {}

  assignRoleToUser = async (req: AuthenticatedRequest, res: Response) => {
    const validatedInput = GrantSimpleRoleRequestSchema.parse(req.body);
    const userId = getParam(req, 'userId', { uuid: true });
    const response = await this.userRoleAppService.grantSimpleRole({ validatedInput, userId });
    res.json(response);
  };

  revokeRoleFromUser = async (req: AuthenticatedRequest, res: Response) => {
    const validatedInput = GrantSimpleRoleRequestSchema.parse(req.body);
    const userId = getParam(req, 'userId', { uuid: true });
    const response = await this.userRoleAppService.revokeSimpleRole({ validatedInput, userId });
    res.json(response);
  };
}
