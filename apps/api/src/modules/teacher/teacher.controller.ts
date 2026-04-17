import { Request, Response } from 'express';
import { CreateTeacherUseCase } from './use-cases/createTeacher.use-case';
import getUrlParam from '@/utils/getUrlParam';
import { createTeacherRequestSchema } from '@repo/contracts/schemas/teacher/createTeacherRequest';
import { TeacherService } from './teacher.service';
import { updateTeacherRequestSchema } from '@repo/contracts/schemas/teacher/updateTeacherRequest';

export class TeacherController {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly createTeacherUseCase: CreateTeacherUseCase,
  ) {}

  create = async (req: Request, res: Response) => {
    const input = createTeacherRequestSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const { teacher, isAccountExist } = await this.createTeacherUseCase.execute({ input, schoolId });
    res.status(201).json({
      message: 'Teacher created successfully',
      data: {
        id: teacher.id,
      },
      accountExists: isAccountExist,
    });
  };

  findById = async (req: Request, res: Response) => {
    const teacherId = getUrlParam(req, 'teacherId', { uuid: true });
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const teacher = await this.teacherService.getById(teacherId, schoolId);
    res.status(200).json({
      message: 'Teacher fetched successfully',
      data: teacher,
    });
  };

  update = async (req: Request, res: Response) => {
    const input = updateTeacherRequestSchema.parse(req.body);
    const teacherId = getUrlParam(req, 'teacherId', { uuid: true });
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const teacher = await this.teacherService.update({ input, teacherId, schoolId });
    res.status(200).json({
      message: 'Teacher updated successfully',
      data: teacher,
    });
  };
}
