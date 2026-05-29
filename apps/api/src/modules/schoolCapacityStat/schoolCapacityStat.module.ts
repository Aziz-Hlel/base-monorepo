import { SchoolCapacityStatController } from './schoolCapacityStat.controller';
import { SchoolCapacityStatRepo } from './schoolCapacityStat.repo';
import { createRoute } from './schoolCapacityStat.route';
import { ExamSessionService } from '../ExamSession/examSession.service';
import { ExamService } from '../Exam/exam.service';
import { UpdateSchoolCapStatUseCase } from './use-case/updateSchoolCapStat.use-case';

export const SchoolCapacityStatModule = (params: {
  examSessionService: ExamSessionService;
  examService: ExamService;
}) => {
  const { examSessionService, examService } = params;
  const schoolCapacityStatRepo = new SchoolCapacityStatRepo();
  const updateSchoolCapStatUseCase = new UpdateSchoolCapStatUseCase(
    schoolCapacityStatRepo,
    examService,
    examSessionService,
  );
  const schoolCapacityStatController = new SchoolCapacityStatController(updateSchoolCapStatUseCase);
  const schoolCapacityStatRoute = createRoute(schoolCapacityStatController);
  return { schoolCapacityStatRoute };
};
