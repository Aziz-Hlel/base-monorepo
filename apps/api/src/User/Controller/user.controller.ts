import { Response } from 'express';
import { AuthenticatedRequest } from '../../types/auth/AuthenticatedRequest';
import { userService } from '../Service/user.service';
import { Page } from '../../types/page/Page';
import { UserProfileRowResponse } from '@contracts/schemas/user/UserRowResponse';
import { queryParamsSchema } from '@contracts/schemas/user/UserPageQuery';

class UserController {
  async getUserPage(req: AuthenticatedRequest, res: Response<Page<UserProfileRowResponse>>) {
    const parsedQuery = queryParamsSchema.parse(req.query);

    const response = await userService.getUserPage(parsedQuery);
    res.json(response);
  }
}

export const userController = new UserController();
