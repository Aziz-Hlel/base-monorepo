import z from 'zod';
import { CityEnum } from '../../types/enums/enums';
import { commonStringSchema } from '../../utils/commonStringSchema';

export const createSchoolRequestSchema = z.object({
  name: commonStringSchema({ fieldName: 'name' }),
  publicId: z //* @todo:make this shit better
    .string()
    .trim()
    .min(3, { message: 'Public ID must be at least 3 characters long' })
    .max(50, { message: 'Public ID must be at most 50 characters long' }),
  city: z.enum(CityEnum),
});

export type CreateSchoolRequest = z.infer<typeof createSchoolRequestSchema>;
