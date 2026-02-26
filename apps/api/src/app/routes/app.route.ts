import { Router } from 'express';
import { RootRouter } from '../../root/router/root.router';
import { AuthRouter } from '../../User/router/auth.route';
import { UserPage } from '../../User/router/user.route';
import { productRouter } from '@/products/products.route';
import { mediaRouter } from '@/media/media.route';
import { EmailRouter } from '@/email/email.route';

const router = Router();

router.use('/', RootRouter);

router.use('/auth', AuthRouter);
router.use('/users', UserPage);
router.use('/media', mediaRouter);
router.use('/products', productRouter);
router.use('/email', EmailRouter);

export default router;
