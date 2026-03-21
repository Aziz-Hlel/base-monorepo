import { AuthController } from './Controller/auth.controller';
import { UserController } from './Controller/user.controller';
import { UserRepo } from './repo/user.repo';
import createUserRouter from './router/user.route';
import { AuthService } from './Service/auth.service';
import { UserInternalService } from './Service/user.internal.service';
import { UserService } from './Service/user.service';
import createAuthRouter from './router/auth.route';

const createAuthModule = (userInternalService: UserInternalService) => {
  const service = new AuthService(userInternalService);
  const controller = new AuthController(service);
  const authRouter = createAuthRouter(controller);

  return { authRouter };
};

const createUserModule = () => {
  const repo = new UserRepo();
  const userInternalService = new UserInternalService(repo);
  const service = new UserService(repo);
  const controller = new UserController(service);
  const userRouter = createUserRouter(controller);

  return { userRouter, userInternalService };
};

export { createAuthModule, createUserModule };
