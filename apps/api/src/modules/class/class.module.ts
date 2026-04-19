import { ClassController } from './class.controller';
import { ClassRepo } from './class.repo';
import { createRouter } from './class.route';
import { ClassService } from './class.service';

export const ClassModule = () => {
  const classRepo = new ClassRepo();
  const classService = new ClassService(classRepo);
  const classController = new ClassController(classService);
  const classRouter = createRouter(classController);
  return { classRouter, classRepo };
};
