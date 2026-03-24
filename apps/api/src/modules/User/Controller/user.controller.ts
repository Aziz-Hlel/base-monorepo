import { Response } from 'express';
import { AuthenticatedRequest } from '../../../types/auth/AuthenticatedRequest';
import { UserProfileRowResponse } from '@repo/contracts/schemas/user/UserRowResponse';
import { queryParamsSchema } from '@repo/contracts/schemas/user/UserPageQuery';
import { createUserProfileRequestSchema } from '@repo/contracts/schemas/profile/createUserProfileRequest';
import { UserProfileResponse } from '@repo/contracts/schemas/profile/UserProfileResponse';
import PERMISSION_SCORE from '@repo/contracts/utils/PermissionScore';
import { PermissionDeniedError } from '@/err/customErrors';
import { SimpleApiResponse } from '@repo/contracts/types/api/SimpleApiResponse.dto';
import { Page } from '@repo/contracts/types/page/Page';
import getParam from '@/utils/getParam';
import { updateUserProfileRequestSchema } from '@repo/contracts/schemas/profile/updateUserProfileRequest';
import { IUserService } from '../Service/user.service';

export class UserController {
  constructor(private readonly userService: IUserService) {}
  getUserPage = async (req: AuthenticatedRequest, res: Response<Page<UserProfileRowResponse>>) => {
    const parsedQuery = queryParamsSchema.parse(req.query);

    const response = await this.userService.getUserPage(parsedQuery);
    res.json(response);
  };

  createUserProfile = async (req: AuthenticatedRequest, res: Response<UserProfileResponse>) => {
    const parsedBody = createUserProfileRequestSchema.parse(req.body);

    const userRole = req.user.claims?.role;
    if (PERMISSION_SCORE[userRole] < PERMISSION_SCORE[parsedBody.role]) {
      throw new PermissionDeniedError(`Insufficient permissions to create a user with role ${parsedBody.role}`);
    }
    const response = await this.userService.createUserProfile(parsedBody);
    res.status(201).json(response);
  };

  updateUserProfile = async (req: AuthenticatedRequest, res: Response<UserProfileResponse>) => {
    const userId = getParam(req, 'id');
    const parsedBody = updateUserProfileRequestSchema.parse(req.body);

    const userRole = req.user.claims?.role;

    const response = await this.userService.updateUserProfile(userId, parsedBody, userRole);
    res.status(200).json(response);
  };

  deleteUserProfile = async (req: AuthenticatedRequest, res: Response<SimpleApiResponse>) => {
    const userToDeleteId = getParam(req, 'id');
    const userRole = req.user.claims?.role;

    await this.userService.deleteUser(userToDeleteId, userRole);

    res.status(204).send({ message: 'User deleted successfully' });
  };

  enableUser = async (req: AuthenticatedRequest, res: Response<SimpleApiResponse>) => {
    const userId = getParam(req, 'id');
    const userRole = req.user.claims?.role;

    await this.userService.enableUser(userId, userRole);

    res.status(200).send({ message: 'User enabled successfully' });
  };

  disableUser = async (req: AuthenticatedRequest, res: Response<SimpleApiResponse>) => {
    const userId = getParam(req, 'id');
    const userRole = req.user.claims?.role;

    await this.userService.disableUser(userId, userRole);

    res.status(200).send({ message: 'User disabled successfully' });
  };
}
