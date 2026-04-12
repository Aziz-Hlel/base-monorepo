import { TeacherAppService } from './teacher.app.service';
import { TeacherController } from './teacher.controller';
import { TeacherRepo } from './teacher.repo';
import { createRouter } from './teacher.route';
import { SchoolService } from '../school/school.service';
import { TeacherService } from './teacher.service';

export const createTeacherModule = ({ schoolService }: { schoolService: SchoolService }) => {
  const teacherRepo = new TeacherRepo();
  const teacherService = new TeacherService(teacherRepo);
  const teacherAppService = new TeacherAppService(teacherService, schoolService);
  const teacherController = new TeacherController(teacherAppService);
  const teacherRouter = createRouter(teacherController);
  return { teacherRouter, teacherService };
};
