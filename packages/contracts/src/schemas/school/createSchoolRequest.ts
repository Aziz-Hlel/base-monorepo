import z from 'zod';
import { commonStringSchema } from '../utils/commonStringSchema';

export const CreateSchoolRequestSchema = z.object({
  nameEn: commonStringSchema({ fieldName: 'nameEn' }),
  nameFr: z.string().trim().min(3).max(255),
  nameAr: z.string().trim().min(3).max(255),
  email: z.email(),
  address: z.string().trim().min(3).max(255),
  phone: z.string().trim().min(7).max(20),
  logoId: z.uuid().nullable(),
});

export type CreateSchoolRequest = z.infer<typeof CreateSchoolRequestSchema>;
