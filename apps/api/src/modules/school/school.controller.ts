import { createSchoolRequestSchema } from '@repo/contracts/schemas/school/createSchoolRequest';
import { SchoolAppService } from './school.app.service';
import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import { Response } from 'express';
import { createSchoolWithUserRequestSchema } from '@repo/contracts/schemas/school/createWithUser';
import { updateSchoolRequestSchema } from '@repo/contracts/schemas/school/updateSchoolRequest';
import getParam from '@/utils/getParam';
export class SchoolController {
  constructor(private readonly schoolAppService: SchoolAppService) {}

  createMySchool = async (req: AuthenticatedRequest, res: Response) => {
    const data = createSchoolRequestSchema.parse(req.body);
    const userId = req.user.claims.id;
    const school = await this.schoolAppService.createMySchool(data, userId);
    res.status(201).json(school);
  };

  createWithUser = async (req: AuthenticatedRequest, res: Response) => {
    const data = createSchoolWithUserRequestSchema.parse(req.body);
    const school = await this.schoolAppService.createWithUser(data);
    res.status(201).json(school);
  };

  updateMySchool = async (req: AuthenticatedRequest, res: Response) => {
    const data = updateSchoolRequestSchema.parse(req.body);
    const schoolId = getParam(req, 'id', { isUuid: true });
    const claims = req.user.claims;
    const school = await this.schoolAppService.updateMySchool(data, schoolId, claims);
    res.status(200).json(school);
  };

  getByUserId = async (req: AuthenticatedRequest, res: Response) => {
    const userId = getParam(req, 'id', { isUuid: true });
    const school = await this.schoolAppService.getByUserId(userId);
    res.status(200).json(school);
  };

  getMySchool = async (req: AuthenticatedRequest, res: Response) => {
    const claims = req.user.claims;
    const school = await this.schoolAppService.getMySchool(claims);
    res.status(200).json(school);
  };
}
