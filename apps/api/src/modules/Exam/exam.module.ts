import { ExamAppService } from './exam.app.service';
import { ExamController } from './exam.controller';
import { ExamRepo } from './exam.repo';
import { createExamRouter } from './exam.route';
import { ExamService } from './exam.service';

export const createExamModule = () => {
  const examRepo = new ExamRepo();
  const examService = new ExamService(examRepo);
  const examAppService = new ExamAppService(examService);
  const examController = new ExamController(examAppService);
  const examRouter = createExamRouter(examController);
  return { examRouter, examService };
};
