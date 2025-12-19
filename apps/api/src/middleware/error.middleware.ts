// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import ENV from '../config/ENV';
import { AppError } from '../err/customErrors';
import { ApiError } from '../err/apiError.type';

const handleZodError = (error: ZodError<unknown>, req: Request): ApiError => {
  const formatted: Record<string, string> = {};

  for (const issue of error.issues) {
    const path = issue.path.join('.');
    formatted[path] = issue.message;
  }

  const apiResponse: ApiError = {
    success: false,
    message: 'Validation failed',
    details: formatted,
    timestamp: new Date(),
    path: req.originalUrl,
  };
  ENV.NODE_ENV !== 'production' && error.stack && (apiResponse.stack = error.stack);
  return apiResponse;
};

export const globalErrorHandler = (error: Error, req: Request, res: Response<ApiError>, next: NextFunction) => {
  const path = req.originalUrl;
  // Zod validation errors
  if (error instanceof ZodError) {
    const apiError = handleZodError(error, req);
    req.log.warn({ err: error, path }, 'Validation error');
    return res.status(400).json(apiError);
  }

  if (AppError.isAppError(error)) {
    req.log.warn({ err: error, path }, 'Application error');
    return res.status(error.status).json(AppError.toApiErrorResponse(error, req));
  }

  // Database errors
  if (error.constructor.name.includes('Prisma')) {
    req.log.error({ err: error, path }, 'Database error');
    return res.status(400).json({
      success: false,
      message: 'Database operation failed',
      timestamp: new Date(),
      path: path,
    });
  }

  // Default 500
  req.log.fatal({ err: error, path }, 'Unhandled error');
  return res.status(500).json({
    success: false,
    message: 'Internal server error, unhandled error type',
    timestamp: new Date(),
    path: path,
  });
};
