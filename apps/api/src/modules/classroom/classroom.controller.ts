import getUrlParam from '@/utils/getUrlParam';
import { Request, Response } from 'express';
import { ClassroomService } from './classroom.service';
import { createClassroomRequestSchema } from '@repo/contracts/schemas/classroom/createClassRequest';
import { updateClassroomRequestSchema } from '@repo/contracts/schemas/classroom/updateClassRequest';

export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  create = async (req: Request, res: Response) => {
    const input = createClassroomRequestSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const createdClass = await this.classroomService.create({ input, schoolId });
    res.status(201).json(createdClass);
  };

  update = async (req: Request, res: Response) => {
    const input = updateClassroomRequestSchema.parse(req.body);
    const classroomId = getUrlParam(req, 'classroomId', { uuid: true });
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const updatedClass = await this.classroomService.update({ input, classroomId, schoolId });
    res.status(200).json(updatedClass);
  };

  findById = async (req: Request, res: Response) => {
    const classroomId = getUrlParam(req, 'classroomId', { uuid: true });
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const foundClass = await this.classroomService.findById({ classroomId, schoolId });
    res.status(200).json(foundClass);
  };
}
