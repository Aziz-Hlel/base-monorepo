import { StudentController } from './student.controller';
import { StudentRepo } from './student.repo';
import { createRouter } from './student.route';
import { StudentService } from './student.service';

export const StudentModule = () => {
  const studentRepo = new StudentRepo();
  const studentService = new StudentService(studentRepo);
  const studentController = new StudentController(studentService);
  const studentRouter = createRouter(studentController);
  return {
    studentRouter,
    studentService,
  };
};
