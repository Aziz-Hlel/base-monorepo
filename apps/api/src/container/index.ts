import { createAuthModule, createUserModule } from '@/modules/User';
import { createProductModule } from '@/modules/products';
import { createRootModule } from '@/modules/root';
import { createMediaModule } from '@/media';

const { rootRouter } = createRootModule();

const { mediaRouter, mediaService } = createMediaModule();

const { userRouter, userInternalService } = createUserModule();
const { authRouter } = createAuthModule(userInternalService);

const { productRouter } = createProductModule(mediaService);

export { rootRouter, userRouter, authRouter, productRouter, mediaRouter, mediaService };
