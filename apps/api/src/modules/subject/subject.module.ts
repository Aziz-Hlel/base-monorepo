import { SubjectController } from './subject.controller';
import { SubjectRepo } from './subject.repo';
import { createRouter } from './subject.route';
import { SubjectService } from './subject.service';

export const SubjectModule = () => {
  const subjectRepo = new SubjectRepo();
  const subjectService = new SubjectService(subjectRepo);
  const subjectController = new SubjectController(subjectService);
  const subjectRouter = createRouter(subjectController);
  return {
    subjectRouter,
  };
};
