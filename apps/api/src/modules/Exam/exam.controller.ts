import { createExamRequestSchema } from '@repo/contracts/schemas/exam/creatExamRequest';
import { ExamAppService } from './exam.app.service';
import { Request, Response } from 'express';
import getParam from '@/utils/getParam';

export class ExamController {
  constructor(private readonly examAppService: ExamAppService) {}
  create = async (req: Request, res: Response) => {
    const payload = createExamRequestSchema.parse(req.body);
    const exam = await this.examAppService.create(payload);
    res.json(exam);
  };

  findById = async (req: Request, res: Response) => {
    const id = getParam(req, 'id', { isUuid: true });
    const exam = await this.examAppService.findById({ id });
    res.json(exam);
  };

  findByMajorId = async (req: Request, res: Response) => {
    const majorId = getParam(req, 'majorId', { isUuid: true });
    const exams = await this.examAppService.findByMajorId({ majorId });
    res.json(exams);
  };

  findAllElectiveExams = async (req: Request, res: Response) => {
    const exams = await this.examAppService.findAllElectiveExams();
    res.json(exams);
  };
}
