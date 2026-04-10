import { CreateUserSchema } from '@repo/contracts/schemas/user/CreateUserDto';
import { Request, Response } from 'express';
import { AccountAppService } from './account.app.service';

export class AccountController {
  constructor(private readonly accountAppService: AccountAppService) {}

  createAdminWithPassword = async (req: Request, res: Response) => {
    const { token } = CreateUserSchema.parse(req.body);
    const user = await this.accountAppService.createAdminWithPassword(token);
    res.status(201).json(user);
  };
}
