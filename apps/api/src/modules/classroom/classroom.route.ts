import { Router } from 'express';
import { ClassroomController } from './classroom.controller';

export const createRouter = (classController: ClassroomController) => {
  const router = Router({ mergeParams: true });
  router.post('/', classController.create);
  router.put('/:classroomId', classController.update);
  router.get('/:classroomId', classController.findById);
  return router;
};
