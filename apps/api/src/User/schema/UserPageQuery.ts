import z from 'zod';
import { createSeachParamsSchemaWithSortFields } from './queryParams/DefaultSeachParamsWithSortFields.js';

export const UserPageQuerySortFields = ['createdAt', 'id', 'email', 'role', 'username'];

const userPageQuerySchema = createSeachParamsSchemaWithSortFields(UserPageQuerySortFields);

export type UserPageQuery = z.infer<typeof userPageQuerySchema>;
export { userPageQuerySchema };
