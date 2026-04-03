import ENV from '../config/env';
import { ApiError } from './apiError.type';
import ERRORS, { ErrNames, ErrObject } from './Errors.object';
import ErrorNames, { ErrorNameKeys } from './errors.names';
import { Request } from 'express';

interface IAppError {
  errorObject: ErrObject;
  clientDisplayMessage?: string;
  message?: string;
  customLog?: string;
  stack?: string;
  cause?: Error;
}

export class AppError extends Error {
  status: number;
  name: ErrNames;
  clientDisplayMessage?: string;
  customLog?: string;
  stack?: string;
  cause?: Error;

  constructor({ errorObject, clientDisplayMessage, message, customLog, stack, cause }: IAppError) {
    super(message || errorObject.message);
    this.name = errorObject.name;
    this.status = errorObject.status;
    this.clientDisplayMessage = clientDisplayMessage;
    this.customLog = customLog;
    this.stack = stack;
    this.cause = cause;
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

type CusmtomErrorPayload =
  | string
  | { message: string; clientDisplayMessage?: string; customLog?: string; stack?: string; cause?: Error };
export class BadRequestError extends AppError {
  constructor(payload: CusmtomErrorPayload) {
    super(toSuperPayload({ errorObject: ERRORS.BAD_REQUEST, payload }));
  }
}

export class UnauthorizedError extends AppError {
  constructor(payload: CusmtomErrorPayload) {
    super(toSuperPayload({ errorObject: ERRORS.UNAUTHORIZED, payload }));
  }
}

export class ForbiddenError extends AppError {
  constructor(payload: CusmtomErrorPayload) {
    super(toSuperPayload({ errorObject: ERRORS.FORBIDDEN, payload }));
  }
}

export class NotFoundError extends AppError {
  constructor(payload: CusmtomErrorPayload) {
    super(toSuperPayload({ errorObject: ERRORS.NOT_FOUND, payload }));
  }
}

export class ConflictError extends AppError {
  constructor(payload: CusmtomErrorPayload) {
    super(toSuperPayload({ errorObject: ERRORS.CONFLICT, payload }));
  }
}

export class PermissionDeniedError extends AppError {
  constructor(payload: CusmtomErrorPayload) {
    super(toSuperPayload({ errorObject: ERRORS.PERMISSION_DENIED, payload }));
  }
}

export class NotImplementedError extends AppError {
  constructor(payload: CusmtomErrorPayload) {
    super(toSuperPayload({ errorObject: ERRORS.NOT_IMPLEMENTED, payload }));
  }
}

export class InternalServerError extends AppError {
  constructor(payload: CusmtomErrorPayload) {
    super(toSuperPayload({ errorObject: ERRORS.INTERNAL_SERVER, payload }));
  }
}

export class CustomError {}

const toSuperPayload = ({ errorObject, payload }: { errorObject: ErrObject; payload: CusmtomErrorPayload }) => {
  if (typeof payload === 'string') {
    return { errorObject, message: payload };
  } else {
    return {
      errorObject,
      message: payload.message,
      clientDisplayMessage: payload.clientDisplayMessage,
      customLog: payload.customLog,
      stack: payload.stack,
      cause: payload.cause,
    };
  }
};
