// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { prettifyError, ZodError } from 'zod';
import ENV from '../config/env';
import { AppError } from '../err/customErrors';
import { ApiError } from '../err/apiError.type';
import { logger } from '../bootstrap/logger.init';
import { AppError2 } from '@/err/customErrors2';
import { serializeUnknownError } from '@/utils/serializeUnknownError';

const handleZodError = (error: ZodError<unknown>, req: Request): ApiError => {
  const formatted: Record<string, string> = {};

  for (const issue of error.issues) {
    const path = issue.path.join('.');
    formatted[path] = issue.message;
  }
  // prettifyError(error);

  const apiResponse: ApiError = {
    success: false,
    message: 'Validation failed',
    details: { 'Zod Error': prettifyError(error) },
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
    logger.warn({ err: { ...error, message: JSON.parse(error.message) }, path }, 'Validation error');
    return res.status(400).json(apiError);
  }

  if (error instanceof AppError2) {
    logger.warn({ err: error, cause: serializeUnknownError(error.cause), path }, 'Application error');
    return res.status(error.status).json(AppError2.toApiErrorResponse(error, req));
  }
  if (AppError.isAppError(error)) {
    logger.warn({ err: error, path }, 'Application error');
    return res.status(error.status).json(AppError.toApiErrorResponse(error, req));
  }

  // Database errors
  if (error.constructor.name.includes('Prisma')) {
    logger.error({ err: error, path }, 'Database error');
    return res.status(400).json({
      success: false,
      message: 'Database operation failed',
      timestamp: new Date(),
      path: path,
    });
  }

  // Default 500
  logger.fatal({ err: error, path }, 'Unhandled error');
  return res.status(500).json({
    success: false,
    message: 'Internal server error, unhandled error type',
    timestamp: new Date(),
    path: path,
  });
};
