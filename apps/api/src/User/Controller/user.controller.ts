import { Request, Response } from 'express';
import { DefaultSearchParams, defaultSearchParamsSchema } from '../../types/api/DefaultSeachParams';
import { AuthenticatedRequest } from '../../types/auth/AuthenticatedRequest';
import { userService } from '../Service/user.service';
import { Page } from '../../types/page/Page';
import { BadRequestError } from '../../err/customErrors';
import { userPageQuerySchema, UserRowResponse } from '@/types/user';

class UserController {
  async getUserPage(req: AuthenticatedRequest, res: Response<Page<UserRowResponse>>) {
    // throw new BadRequestError('Not implemented yet');
    const parsedQuery = userPageQuerySchema.parse(req.query);

    const response = await userService.getUserPage(parsedQuery);
    res.json(response);
  }
}

export const userController = new UserController();
