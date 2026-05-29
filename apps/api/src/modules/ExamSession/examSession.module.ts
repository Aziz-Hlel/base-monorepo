import { ExamSessionRepo } from './examSession.repo';
import { AssignMajorExamsToClassUseCase } from './use-case/assignMajorExamsToClassUseCase';
import { ExamRepo } from '../Exam/exam.repo';
import { ExamSessionController } from './examSession.controller';
import { createRoute } from './examSession.route';
import { AssignElectiveExamToClassUseCase } from './use-case/assignElectiveExamToClassUseCase';
import { AssignOrchestrator } from './orchestrator/assign.orchestrator';
import { AssignExamToClassesUseCase } from './use-case/assignExamToClasses';
import { ClassRepo } from '../class/class.repo';
import { ExamSessionService } from './examSession.service';

export const ExamSessionModule = ({ examRepo, classRepo }: { examRepo: ExamRepo; classRepo: ClassRepo }) => {
  const examSessionRepo = new ExamSessionRepo();
  const assignMajorExamToClassUseCase = new AssignMajorExamsToClassUseCase(examSessionRepo, examRepo);
  const assignElectiveExamToClassUseCase = new AssignElectiveExamToClassUseCase(examSessionRepo, examRepo);
  const assignExamToClassesUseCase = new AssignExamToClassesUseCase(classRepo, examSessionRepo);
  const assignOrchestrator = new AssignOrchestrator(
    assignMajorExamToClassUseCase,
    assignElectiveExamToClassUseCase,
    assignExamToClassesUseCase,
  );
  const examSessionController = new ExamSessionController(assignOrchestrator);
  const examSessionRouter = createRoute(examSessionController);
  const examSessionService = new ExamSessionService(examSessionRepo);
  return {
    examSessionRouter,
    examSessionService,
  };
};
