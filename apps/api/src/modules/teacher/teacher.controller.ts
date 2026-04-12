import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import { TeacherAppService } from './teacher.app.service';
import { createTeacherRequestSchema } from '@repo/contracts/schemas/teacher/createTeacherRequest';
import { updateTeacherRequestSchema } from '@repo/contracts/schemas/teacher/updateTeacherRequest';
import getParam from '@/utils/getParam';
import { Response } from 'express';

export class TeacherController {
  constructor(private readonly teacherAppService: TeacherAppService) {}

  create = async (req: AuthenticatedRequest, res: Response) => {
    const data = createTeacherRequestSchema.parse(req.body);
    const schoolId = getParam(req, 'schoolId', { isUuid: true });
    const claims = req.user.claims;
    const teacher = await this.teacherAppService.create(data, schoolId, claims);
    res.status(201).json(teacher);
  };

  update = async (req: AuthenticatedRequest, res: Response) => {
    const data = updateTeacherRequestSchema.parse(req.body);
    const schoolId = getParam(req, 'schoolId', { isUuid: true });
    const teacherId = getParam(req, 'teacherId', { isUuid: true });
    const claims = req.user.claims;
    const teacher = await this.teacherAppService.update(data, schoolId, teacherId, claims);
    res.status(200).json(teacher);
  };

  delete = async (req: AuthenticatedRequest, res: Response) => {
    const teacherId = getParam(req, 'teacherId', { isUuid: true });
    const teacher = await this.teacherAppService.delete(teacherId);
    res.status(200).json(teacher);
  };

  getBySchoolId = async (req: AuthenticatedRequest, res: Response) => {
    // * you might wanna add query params to this not just give all teachers without pagination
    const schoolId = getParam(req, 'schoolId', { isUuid: true });
    const claims = req.user.claims;
    const teacher = await this.teacherAppService.getBySchoolId(schoolId, claims);
    res.status(200).json(teacher);
  };

  getById = async (req: AuthenticatedRequest, res: Response) => {
    const teacherId = getParam(req, 'teacherId', { isUuid: true });
    const schoolId = getParam(req, 'schoolId', { isUuid: true });
    const claims = req.user.claims;
    const teacher = await this.teacherAppService.getById(teacherId, schoolId, claims);
    res.status(200).json(teacher);
  };
}
