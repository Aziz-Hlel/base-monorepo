import { ExamService } from '@/modules/Exam/exam.service';
import { CreateExamRequest } from '@repo/contracts/schemas/exam/creatExamRequest';

export class ExamSeedService {
  constructor(private readonly examService: ExamService) {}

  run = async ({ data }: { data: CreateExamRequest }) => {
    const exam = await this.examService.findOrCreate(data);
    return exam;
  };
}
