import { createRouter } from './classroom.route';
import { ClassroomService } from './classroom.service';
import { ClassroomRepo } from './classroom.repo';
import { ClassroomController } from './classroom.controller';

export const ClassroomModule = () => {
  const classesRepo = new ClassroomRepo();
  const classService = new ClassroomService(classesRepo);
  const classController = new ClassroomController(classService);
  const classRouter = createRouter(classController);
  return { classRouter };
};
