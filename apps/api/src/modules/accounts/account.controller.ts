import { CreateUserSchema } from '@repo/contracts/schemas/user/CreateUserDto';
import { Request, Response } from 'express';
import { AccountService } from './account.service';
import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';

export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  createAdminAccountWithPassword = async (req: Request, res: Response) => {
    const { token } = CreateUserSchema.parse(req.body);
    const user = await this.accountService.createAdminAccountWithPassword(token);
    res.status(201).json(user);
  };

  authenticateWithPassword = async (req: Request, res: Response) => {
    const { token } = CreateUserSchema.parse(req.body);
    const user = await this.accountService.authenticateWithPassword(token);
    res.status(200).json(user);
  };

  authenticateWithProvider = async (req: Request, res: Response) => {
    const { token } = CreateUserSchema.parse(req.body);
    const user = await this.accountService.authenticateWithProvider(token);
    res.status(200).json(user);
  };

  me = async (req: AuthenticatedRequest, res: Response) => {
    const user = await this.accountService.me(req.user);
    res.status(200).json(user);
  };
}
