import z from 'zod';

export const dateStringSchema = z.string().refine((dateString) => !isNaN(new Date(dateString).getTime()), {
  message: 'Invalid date string',
});

export const emailSchema = z.email();

export const uuidSchema = z.uuid();
