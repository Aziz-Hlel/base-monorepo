import getUrlParam from '@/utils/getUrlParam';
import { Request, Response } from 'express';
import { ClassroomService } from './classroom.service';
import { createClassroomRequestSchema } from '@repo/contracts/schemas/classroom/createClassRequest';
import { updateClassroomRequestSchema } from '@repo/contracts/schemas/classroom/updateClassRequest';
import { CreateClassroomUseCase } from './use-case/createClassroom.use-case';

export class ClassroomController {
  constructor(
    private readonly classroomService: ClassroomService,
    private readonly createClassroomUseCase: CreateClassroomUseCase,
  ) {}

  create = async (req: Request, res: Response) => {
    const input = createClassroomRequestSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const createdClass = await this.createClassroomUseCase.execute({ input, schoolId });
    res.status(201).json({
      message: 'Class created successfully',
      createdClass,
    });
  };

  update = async (req: Request, res: Response) => {
    const input = updateClassroomRequestSchema.parse(req.body);
    const classroomId = getUrlParam(req, 'classroomId', { uuid: true });
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const updatedClass = await this.classroomService.update({ input, classroomId, schoolId });
    res.status(200).json({
      message: 'Class updated successfully',
      updatedClass,
    });
  };

  findById = async (req: Request, res: Response) => {
    const classroomId = getUrlParam(req, 'classroomId', { uuid: true });
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const foundClass = await this.classroomService.findById({ classroomId, schoolId });
    res.status(200).json({
      message: 'Class found successfully',
      foundClass,
    });
  };
}
