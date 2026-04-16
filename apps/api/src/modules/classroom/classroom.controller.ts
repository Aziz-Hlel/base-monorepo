import getParam from '@/utils/getParam';
import { createClassRequestSchema } from '@repo/contracts/schemas/class/createClassRequest';
import { updateClassRequestSchema } from '@repo/contracts/schemas/class/updateClassRequest';
import { Request, Response } from 'express';
import { ClassroomService } from './classroom.service';

export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  create = async (req: Request, res: Response) => {
    const input = createClassRequestSchema.parse(req.body);
    const schoolId = getParam(req, 'schoolId', { uuid: true });
    const createdClass = await this.classroomService.create({ input, schoolId });
    res.status(201).json(createdClass);
  };

  update = async (req: Request, res: Response) => {
    const input = updateClassRequestSchema.parse(req.body);
    const classroomId = getParam(req, 'classroomId', { uuid: true });
    const schoolId = getParam(req, 'schoolId', { uuid: true });
    const updatedClass = await this.classroomService.update({ input, classroomId, schoolId });
    res.status(200).json(updatedClass);
  };

  findById = async (req: Request, res: Response) => {
    const classroomId = getParam(req, 'classroomId', { uuid: true });
    const schoolId = getParam(req, 'schoolId', { uuid: true });
    const foundClass = await this.classroomService.findById({ classroomId, schoolId });
    res.status(200).json(foundClass);
  };
}
