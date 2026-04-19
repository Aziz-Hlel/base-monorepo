import { ClassAssignmentsRequest } from '@repo/contracts/schemas/examSession/classAssignmentsRequest';
import { AssignElectiveExamToClassUseCase } from '../use-case/assignElectiveExamToClassUseCase';
import { AssignExamToClassesUseCase } from '../use-case/assignExamToClasses';
import { AssignMajorExamsToClassUseCase } from '../use-case/assignMajorExamsToClassUseCase';

export class AssignOrchestrator {
  constructor(
    private readonly assignMajorExamToClassUseCase: AssignMajorExamsToClassUseCase,
    private readonly assignElectiveExamToClassUseCase: AssignElectiveExamToClassUseCase,
    private readonly assignExamToClassesUseCase: AssignExamToClassesUseCase,
  ) {}

  assign = async (input: ClassAssignmentsRequest) => {
    let examSession;
    switch (input.type) {
      case 'major':
        examSession = await this.assignMajorExamToClassUseCase.execute({
          classId: input.classId,
          majorId: input.majorId,
        });
        break;
      case 'elective':
        examSession = await this.assignElectiveExamToClassUseCase.execute({
          classId: input.classId,
          electiveExamId: input.electiveExamId,
        });
        break;
      case 'exam':
        examSession = await this.assignExamToClassesUseCase.execute({ classIds: input.classIds, examId: input.examId });
        break;
    }
    return examSession;
  };
}
