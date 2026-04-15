import { CreateSimpleUserUseCase } from '../User/use-cases/createSimpleUser.use-case';
import { UserService } from '../User/user.service';
import { StaffController } from './staff.controller';
import { StaffHelper } from './staff.helper';
import { StaffRepo } from './staff.repo';
import { createRoute as createRouter } from './staff.route';
import { StaffService } from './staff.service';

export const StaffModule = (params: { createSimpleUserUseCase: CreateSimpleUserUseCase; userService: UserService }) => {
  const { createSimpleUserUseCase, userService } = params;
  const repo = new StaffRepo();
  const helper = new StaffHelper();
  const staffService = new StaffService(userService, helper);

  const staffController = new StaffController(staffService, createSimpleUserUseCase);
  const staffRouter = createRouter(staffController);
  return { staffRouter };
};
