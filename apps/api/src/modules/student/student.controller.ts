import { createStudentRequestSchema } from '@repo/contracts/schemas/student/createStudentRequest';
import { StudentService } from './student.service';
import { Request, Response } from 'express';
import getUrlParam from '@/utils/getUrlParam';
import { updateStudentRequestSchema } from '@repo/contracts/schemas/student/updateStudentRequest';

export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  create = async (req: Request, res: Response) => {
    const input = createStudentRequestSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const response = await this.studentService.create({ input, schoolId });
    res.status(201).json({
      message: 'Student created successfully',
      data: response,
    });
  };

  update = async (req: Request, res: Response) => {
    const input = updateStudentRequestSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const studentId = getUrlParam(req, 'studentId', { uuid: true });
    const response = await this.studentService.update({ input, schoolId, studentId });
    res.status(200).json({
      message: 'Student updated successfully',
      data: response,
    });
  };

  findById = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const studentId = getUrlParam(req, 'studentId', { uuid: true });
    const response = await this.studentService.findById({ schoolId, studentId });
    res.status(200).json({
      message: 'Student found successfully',
      data: response,
    });
  };
}
