import { Request, Response } from 'express';
import { AssignmentService } from './assignment.service';
import getUrlParam from '@/utils/getUrlParam';
import { SyncAssignmentRequestSchema } from '@repo/contracts/schemas/assignment/syncAssignmentRequest';

export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  syncMany = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const classroomId = getUrlParam(req, 'classroomId', { uuid: true });
    const input = SyncAssignmentRequestSchema.parse(req.body);

    const result = await this.assignmentService.syncMany({
      schoolId,
      classroomId,
      input,
    });
    let statusCode: number;
    let message: string;
    if (result.successCount === 0) {
      statusCode = 400;
      message = 'Failed to sync assignments';
    } else if (result.successCount === input.length) {
      statusCode = 201;
      message = 'Assignments synced successfully';
    } else {
      statusCode = 207;
      message = 'Partial success: some assignments were synced';
    }
    res.status(statusCode).json({
      message,
      data: {
        successCount: result.successCount,
        failed: result.failedAssignments,
      },
    });
  };
}
