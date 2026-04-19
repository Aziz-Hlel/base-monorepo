import { MajorAppService } from './major.app.service';
import { Request, Response } from 'express';
import { createMajorRequestSchema } from '@repo/contracts/schemas/major/createMajorRequest';
import getUrlParam from '@/utils/getUrlParam';
import { isMajorEnum } from '@repo/contracts/schemas/major/utils';
import { BadRequestError } from '@/err/customErrors';

export class MajorController {
  constructor(private readonly majorAppService: MajorAppService) {}

  create = async (req: Request, res: Response) => {
    const payload = createMajorRequestSchema.parse(req.body);
    console.log('rab om l payload ', payload);
    const major = await this.majorAppService.create(payload);
    res.json(major);
  };

  findAll = async (req: Request, res: Response) => {
    const majors = await this.majorAppService.findAll();
    res.json(majors);
  };

  findByName = async (req: Request, res: Response) => {
    const majorName = getUrlParam(req, 'name');
    if (!isMajorEnum(majorName)) throw new BadRequestError('Invalid major name');
    const major = await this.majorAppService.findByName(majorName);
    res.json(major);
  };
}
