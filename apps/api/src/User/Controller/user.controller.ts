import type { Response } from 'express';
import { userService } from '../Service/user.service';
import type { Page } from '../../types/page/Page';
import type { UserRowResponse } from '../schema/UserRowResponse';
import { userPageQuerySchema } from '../schema';
import { AuthenticatedRequest } from '../../types/auth/AuthenticatedRequest';

class UserController {
  async getUserPage(req: AuthenticatedRequest, res: Response<Page<UserRowResponse>>) {
    // throw new BadRequestError('Not implemented yet');
    const parsedQuery = userPageQuerySchema.parse(req.query);

    const response = await userService.getUserPage(parsedQuery);
    res.json(response);
  }
}

export const userController = new UserController();
