import z from 'zod';
import { ENTITY_TYPE } from './EntityType';

const oneMb = 1024 * 1024;
const maxFileSize = 100 * oneMb;

export const presignedUrlRequestSchema = z.object({
  mimeType: z.string().trim().min(1),
  fileSize: z.number().positive().max(maxFileSize),
  fileType: z.enum(['webp', 'jpg', 'jpeg', 'png', 'mp4', 'mov', 'avi', 'gif']),
  name: z.string().trim().min(1).max(255),
  entityType: z.enum(ENTITY_TYPE),
  mediaPurpose: z.string().trim().min(1).max(100),
});

export type PresignedUrlRequest = z.infer<typeof presignedUrlRequestSchema>;
