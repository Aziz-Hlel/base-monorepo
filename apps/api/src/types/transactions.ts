import { MediaDelegate, ProductDelegate } from '@/generated/prisma/models';
import { DefaultArgs } from '@prisma/client/runtime/client';

export type MediaTransaction = MediaDelegate<DefaultArgs, { omit: undefined }>;
export type ProductTransaction = ProductDelegate<DefaultArgs, { omit: undefined }>;
