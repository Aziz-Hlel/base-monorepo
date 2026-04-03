import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../../types/auth/AuthenticatedRequest';
import { CreateUserSchema } from '@repo/contracts/schemas/user/CreateUserDto';
import { IAuthService } from '../Service/auth.service';

export class AuthController {
  constructor(private readonly authService: IAuthService) {}
  register = async (req: Request, res: Response) => {
    const { token: idToken } = CreateUserSchema.parse(req.body);

    const user = await this.authService.registerUser(idToken);

    res.status(201).json(user);
  };

  loginWithPassword = async (req: Request, res: Response) => {
    const { token: idToken } = CreateUserSchema.parse(req.body);

    const user = await this.authService.authenticateWithPassword(idToken);
    res.status(200).json(user);
  };

  authenticateWithProvider = async (req: Request, res: Response) => {
    const { token: idToken } = CreateUserSchema.parse(req.body);
    const user = await this.authService.authenticateWithProvider(idToken);

    res.status(200).json(user);
  };

  me = async (req: AuthenticatedRequest, res: Response) => {
    const idToken = req.token;

    const user = await this.authService.me(idToken);

    res.status(200).json(user);
  };
}
