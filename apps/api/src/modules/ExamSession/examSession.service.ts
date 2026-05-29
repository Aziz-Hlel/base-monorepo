import { ExamSessionRepo } from './examSession.repo';

export class ExamSessionService {
  constructor(private readonly examSessionRepo: ExamSessionRepo) {}

  unassignByExamIds = async (params: { schoolId: string; examIds: string[] }) => {
    const { schoolId, examIds } = params;

    return await this.examSessionRepo.deleteManyByExamIds({ schoolId, examIds });
  };
}
