import { ExamSessionRepo } from './examSession.repo';

export class ExamSessionService {
  constructor(private readonly examSessionRepo: ExamSessionRepo) {}

  assignMajorExamToClass = async (params: { majorId: string; classId: string }) => {};
}
