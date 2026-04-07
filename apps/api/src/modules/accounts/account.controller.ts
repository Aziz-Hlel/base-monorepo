import { CreateUserSchema } from '@repo/contracts/schemas/user/CreateUserDto';
import { Request, Response } from 'express';
import { AccountAppService } from './account.app.service';
import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';

export class AccountController {
  constructor(private readonly accountAppService: AccountAppService) {}

  createAdminAccountWithPassword = async (req: Request, res: Response) => {
    const { token } = CreateUserSchema.parse(req.body);
    const user = await this.accountAppService.createAdminAccountWithPassword(token);
    res.status(201).json(user);
  };

  authenticateWithPassword = async (req: Request, res: Response) => {
    const { token } = CreateUserSchema.parse(req.body);
    const user = await this.accountAppService.authenticateWithPassword(token);
    res.status(200).json(user);
  };

  authenticateWithProvider = async (req: Request, res: Response) => {
    const { token } = CreateUserSchema.parse(req.body);
    const user = await this.accountAppService.authenticateWithProvider(token);
    res.status(200).json(user);
  };

  me = async (req: AuthenticatedRequest, res: Response) => {
    const user = await this.accountAppService.me(req.token);
    res.status(200).json(user);
  };
}
