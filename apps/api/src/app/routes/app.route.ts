import { Router } from 'express';
import { AuthRouter } from '@/modules/User/router/auth.route';
import { UserPage } from '@/modules/User/router/user.route';
import { mediaRouter } from '@/media/media.route';
import { EmailRouter } from '@/email/email.route';
import { productRouter } from '@/modules/products/products.route';
import { RootRouter } from '@/modules/root/router/root.router';

const router = Router();

router.use('/', RootRouter);
router.use('/auth', AuthRouter);
router.use('/users', UserPage);
router.use('/media', mediaRouter);
router.use('/products', productRouter);
router.use('/email', EmailRouter);

export default router;
