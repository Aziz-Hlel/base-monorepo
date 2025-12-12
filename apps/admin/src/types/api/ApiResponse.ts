import z from 'zod';

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export const apiErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  status: z.number(),
  timestamp: z.coerce.date(),
  path: z.string(),
  error: z.unknown().optional(), // ? not quite my tempo
});

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
