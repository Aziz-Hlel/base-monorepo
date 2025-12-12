import { Router } from "express";
import { RootRouter } from "../../root/router/root.router";
import { AuthRouter } from "../../User/router/auth.router";
import { UserPage } from "../../User/router/user.router";


const router = Router();


router.use('/', RootRouter);

router.use('/auth', AuthRouter);
router.use('/users', UserPage);

export const AppRouter = router;
