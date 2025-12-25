import ENV from '../config/ENV';
import { ApiError } from './apiError.type';
import ErrorNames, { ErrorNameKeys } from './errors.names';
import { Request } from 'express';

export class AppError extends Error {
  status: number;
  constructor({ status, message, name }: { status: number; message: string; name: string }) {
    super(message);
    this.name = name;
    this.status = status;
  }

  static isAppError(error: Error): error is AppError {
    return !!error.name && Object.values(ErrorNames).includes(error.name as ErrorNameKeys);
  }

  static toApiErrorResponse(error: AppError, req: Request): ApiError {
    const apiResponse: ApiError = {
      success: false,
      message: error.message,
      timestamp: new Date(),
      path: req.originalUrl,
    };
    ENV.NODE_ENV !== 'production' && error.stack && (apiResponse.stack = error.stack);
    return apiResponse;
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super({ status: 400, message, name: ErrorNames.BAD_REQUEST });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super({ status: 401, message, name: ErrorNames.UNAUTHORIZED });
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super({ status: 403, message, name: ErrorNames.FORBIDDEN });
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super({ status: 404, message, name: ErrorNames.NOT_FOUND });
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super({ status: 409, message, name: ErrorNames.CONFLICT });
  }
}

export class PermissionDeniedError extends AppError {
  constructor(message: string) {
    super({ status: 403, message, name: ErrorNames.PERMISSION_DENIED });
  }
}

export class InternalServerError extends AppError {
  constructor(message: string) {
    super({ status: 500, message, name: ErrorNames.INTERNAL_SERVER });
  }
}
