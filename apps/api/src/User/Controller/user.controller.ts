import { Response } from 'express';
import { AuthenticatedRequest } from '../../types/auth/AuthenticatedRequest';
import { userService } from '../Service/user.service';
import { Page } from '../../types/page/Page';
import { UserProfileRowResponse } from '@contracts/schemas/user/UserRowResponse';
import { queryParamsSchema } from '@contracts/schemas/user/UserPageQuery';
import { createUserProfileRequestSchema } from '@contracts/schemas/profile/createUserProfileRequest';
import { UserProfileResponse } from '@contracts/schemas/profile/UserProfileResponse';
import PERMISSION_SCORE from '@contracts/utils/PermissionScore';
import { PermissionDeniedError } from '@/err/customErrors';
import { SimpleApiResponse } from '@contracts/types/api/SimpleApiResponse.dto';

class UserController {
  async getUserPage(req: AuthenticatedRequest, res: Response<Page<UserProfileRowResponse>>) {
    const parsedQuery = queryParamsSchema.parse(req.query);

    const response = await userService.getUserPage(parsedQuery);
    res.json(response);
  }

  async createUserProfile(req: AuthenticatedRequest, res: Response<UserProfileResponse>) {
    const parsedBody = createUserProfileRequestSchema.parse(req.body);

    const userRole = req.user.claims?.role;
    if (PERMISSION_SCORE[userRole] < PERMISSION_SCORE[parsedBody.role]) {
      throw new PermissionDeniedError(`Insufficient permissions to create a user with role ${parsedBody.role}`);
    }
    const response = await userService.createUserProfile(parsedBody);
    res.status(201).json(response);
  }

  async deleteUserProfile(req: AuthenticatedRequest, res: Response<SimpleApiResponse>) {
    const userToDeleteId = req.params.id;
    const userRole = req.user.claims?.role;

    await userService.deleteUser(userToDeleteId, userRole);

    res.status(204).send({ message: 'User deleted successfully' });
  }
}

export const userController = new UserController();
