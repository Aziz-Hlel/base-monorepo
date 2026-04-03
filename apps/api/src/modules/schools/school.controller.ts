import { CreateSchoolRequestSchema } from '@repo/contracts/schemas/school/createSchoolRequest';
import { ISchoolService, SchoolService } from './school.service';
import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import { Response } from 'express';
import { updateSchoolRequestSchema } from '@repo/contracts/schemas/school/updateSchoolRequest';
import getParam from '@/utils/getParam';

export class SchoolController {
  constructor(private readonly schoolService: ISchoolService) {}

  create = async (req: AuthenticatedRequest, res: Response) => {
    const schema = CreateSchoolRequestSchema.parse(req.body);
    const token = req.token;
    const school = await this.schoolService.create({ schema, token });
    res.status(201).json({ message: 'School created successfully', id: school.id });
  };

  update = async (req: AuthenticatedRequest, res: Response) => {
    const schema = updateSchoolRequestSchema.parse(req.body);
    const token = req.token;
    const schoolId = getParam(req, 'schoolId');
    await this.schoolService.update({ schema, token, schoolId });
    res.status(200).json({ message: 'School updated successfully' });
  };

  getMySchool = async (req: AuthenticatedRequest, res: Response) => {
    const school = await this.schoolService.getMySchool({ token: req.token });
    res.status(200).json(school);
  };

  getById = async (req: AuthenticatedRequest, res: Response) => {
    const schoolId = getParam(req, 'schoolId');
    const school = await this.schoolService.getById({ schoolId, token: req.token });
    res.status(200).json(school);
  };

  getPage = async (req: AuthenticatedRequest, res: Response) => {};

  delete = async (req: AuthenticatedRequest, res: Response) => {};
}
