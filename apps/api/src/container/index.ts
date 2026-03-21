import { createAuthModule, createUserModule } from '@/modules/User';
import { createProductModule } from '@/modules/products';
import { createRootModule } from '@/modules/root';
import { createMediaModule } from '@/media';

// * ROOT
const { rootRouter } = createRootModule();

// * MEDIA
const { mediaRouter, mediaService } = createMediaModule();

// * USER
const { userRouter, userInternalService } = createUserModule();
const { authRouter } = createAuthModule(userInternalService);

// * PRODUCT
const { productRouter } = createProductModule(mediaService);

export { rootRouter, userRouter, authRouter, productRouter, mediaRouter, mediaService };
