import { StudentController } from './student.controller';
import { StudentRepo } from './student.repo';
import { createRouter } from './student.route';
import { StudentService } from './student.service';
import { StudentParentService } from './studentParent.service';
import { StudentParentRepo } from './studentParent.repo';

export const StudentModule = () => {
  const studentRepo = new StudentRepo();
  const studentService = new StudentService(studentRepo);
  const studentParentRepo = new StudentParentRepo();
  const studentParentService = new StudentParentService(studentParentRepo);
  const studentController = new StudentController(studentService, studentParentService);
  const studentRouter = createRouter(studentController);
  return {
    studentRouter,
    studentService,
  };
};
