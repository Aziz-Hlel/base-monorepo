import { SchoolController } from './school.controller';
import { SchoolRepo } from './school.repo';
import { createSchoolRoute } from './school.route';
import { SchoolService } from './school.service';

export const createSchoolModule = () => {
  const repo = new SchoolRepo();
  const service = new SchoolService(repo);
  const controller = new SchoolController(service);
  const schoolRouter = createSchoolRoute(controller);
  return { schoolRouter };
};
