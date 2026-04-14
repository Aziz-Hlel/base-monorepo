import { CreateSimpleUserUseCase } from '../User/use-cases/createSimpleUser.use-case';
import { StaffController } from './staff.controller';
import { createRoute as createRouter } from './staff.route';

export const StaffModule = ({ createSimpleUserUseCase }: { createSimpleUserUseCase: CreateSimpleUserUseCase }) => {
  const staffController = new StaffController(createSimpleUserUseCase);
  const staffRouter = createRouter(staffController);
  return { staffRouter };
};
