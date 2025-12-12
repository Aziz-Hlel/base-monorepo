import { Request, Response } from 'express';
import { DefaultSearchParams, defaultSearchParamsSchema } from '../../types/api/DefaultSeachParams';
import { UserPageQuery, userPageQuerySchema } from '../schema/UserPageQuery';
import { AuthenticatedRequest } from '../../types/auth/AuthenticatedRequest';
import { userService } from '../Service/user.service';
import { Page } from '../../types/page/Page';
import { UserRowResponse } from '../schema/UserRowResponse';
import { BadRequestError } from '../../err/customErrors';

class UserController {
  async getUserPage(req: AuthenticatedRequest, res: Response<Page<UserRowResponse>>) {
    // throw new BadRequestError('Not implemented yet');
    const parsedQuery = userPageQuerySchema.parse(req.query);

    const response = await userService.getUserPage(parsedQuery);
    res.json(response);
  }
}

export const userController = new UserController();
