import { MajorAppService } from './major.app.service';
import { MajorController } from './major.controller';
import { MajorRepo } from './major.repo';
import { createMajorRouter } from './major.route';
import { MajorService } from './major.service';

export const createMajorModule = () => {
  const majorRepo = new MajorRepo();
  const majorService = new MajorService(majorRepo);
  const majorAppService = new MajorAppService(majorService);
  const majorController = new MajorController(majorAppService);
  const majorRouter = createMajorRouter(majorController);
  return { majorRouter, majorService };
};
