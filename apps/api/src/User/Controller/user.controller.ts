import { Response } from 'express';
import { AuthenticatedRequest } from '../../types/auth/AuthenticatedRequest';
import { userService } from '../Service/user.service';
import { Page } from '../../types/page/Page';
import { UserRowResponse } from '@contracts/types/user/UserRowResponse';
import { queryParamsSchema } from '@/types/user/UserPageQuery';

class UserController {
  async getUserPage(req: AuthenticatedRequest, res: Response<Page<UserRowResponse>>) {
    // throw new BadRequestError('Not implemented yet');
    console.log('quey raw :', req.query);
    const parsedQuery = queryParamsSchema.parse(req.query);

    const response = await userService.getUserPage(parsedQuery);
    res.json(response);
  }
}

export const userController = new UserController();
