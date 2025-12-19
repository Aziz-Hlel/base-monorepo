import { Request, Response } from 'express';
import { authService as authService } from '../Service/auth.service';
import { AuthenticatedRequest } from '../../types/auth/AuthenticatedRequest';
import { UserProfileResponse } from '@contracts/types/user/UserProfileResponse';
import { CreateUserSchema } from '@contracts/types/user/CreateUserDto';

class AuthController {
  async register(req: Request, res: Response<UserProfileResponse>) {
    const { idToken } = CreateUserSchema.parse(req.body);

    const user = await authService.registerUser(idToken);

    res.status(201).json(user);
  }

  async loginWithPassword(req: Request, res: Response<UserProfileResponse>) {
    const { idToken } = CreateUserSchema.parse(req.body);

    const user = await authService.loginUser(idToken);
    res.status(200).json(user);
  }

  async authenticateWithProvider(req: Request, res: Response<UserProfileResponse>) {
    const { idToken } = CreateUserSchema.parse(req.body);
    const user = await authService.authenticateWithProvider(idToken);

    res.status(200).json(user);
  }

  async me(req: AuthenticatedRequest, res: Response<UserProfileResponse>) {
    const idToken = req.user;

    const user = await authService.me(idToken);

    res.status(200).json(user);
  }
}

export const authController = new AuthController();
