import { CreateUserSchema } from '@repo/contracts/schemas/user/CreateUserDto';
import { Request, Response } from 'express';
import { OwnerService } from './owner.service';
import { createOwnerRequestSchema } from '@repo/contracts/schemas/owner/createOwnerRequest';
import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';

export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  create = async (req: AuthenticatedRequest, res: Response) => {
    const schema = createOwnerRequestSchema.parse(req.body);
    const token = req.user;
    const user = await this.ownerService.create({ schema, token });
    res.status(201).json(user);
  };
}
