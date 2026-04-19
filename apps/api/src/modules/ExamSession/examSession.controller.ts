import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import { AssignMajorExamsToClassUseCase } from './use-case/assignMajorExamsToClassUseCase';
import getUrlParam from '@/utils/getUrlParam';
import { Response } from 'express';
import { AssignElectiveExamToClassUseCase } from './use-case/assignElectiveExamToClassUseCase';
import { classAssignmentsRequestSchema } from '@repo/contracts/schemas/examSession/classAssignmentsRequest';
import { AssignOrchestrator } from './orchestrator/assign.orchestrator';

export class ExamSessionController {
  constructor(private readonly assignOrchestrator: AssignOrchestrator) {}

  assign = async (req: AuthenticatedRequest, res: Response) => {
    const input = classAssignmentsRequestSchema.parse(req.body);
    const response = await this.assignOrchestrator.assign(input);
    res.status(200).json(response);
  };
}
