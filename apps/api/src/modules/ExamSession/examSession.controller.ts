import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import { classAssignmentsRequestSchema } from '@repo/contracts/schemas/examSession/classAssignmentsRequest';
import { Response } from 'express';
import { AssignOrchestrator } from './orchestrator/assign.orchestrator';

export class ExamSessionController {
  constructor(private readonly assignOrchestrator: AssignOrchestrator) {}

  assign = async (req: AuthenticatedRequest, res: Response) => {
    // ! add schoolId to do operation with it in the db for RLS (row level security)

    const input = classAssignmentsRequestSchema.parse(req.body);
    const response = await this.assignOrchestrator.assign(input);
    res.status(200).json(response);
  };

  // ! pretty sure you neeed unassaign to so fck you for not doing it earlier
}
