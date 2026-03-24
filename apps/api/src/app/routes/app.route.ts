import { Router } from 'express';
import { EmailRouter } from '@/email/email.route';
import { authRouter, mediaRouter, notificationRouter, productRouter, rootRouter, userRouter } from '@/container';

const router = Router();

router.use('/', rootRouter);
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/media', mediaRouter);
router.use('/products', productRouter);
router.use('/email', EmailRouter);
router.use('/notification', notificationRouter);

export default router;
