import ENV from '../config/ENV';
import { ApiError } from './apiError.type';
import ERRORS, { ErrNames, ErrObject } from './Errors.object';
import ErrorNames, { ErrorNameKeys } from './errors.names';
import { Request } from 'express';

export class AppError extends Error {
  status: number;
  name: ErrNames;
  clientDisplayMessage?: string;

  constructor({
    errorObject,
    clientDisplayMessage,
    message,
  }: {
    errorObject: ErrObject;
    clientDisplayMessage?: string;
    message?: string;
  }) {
    super(message || errorObject.message);
    this.name = errorObject.name;
    this.status = errorObject.status;
    this.clientDisplayMessage = clientDisplayMessage;
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

type CusmtomErrorPayload = string | { message: string; clientDisplayMessage?: string };
export class BadRequestError extends AppError {
  constructor(payload: CusmtomErrorPayload) {
    if (typeof payload === 'string') {
      super({ errorObject: ERRORS.BAD_REQUEST, message: payload });
    } else {
      super({
        errorObject: ERRORS.BAD_REQUEST,
        message: payload.message,
        clientDisplayMessage: payload.clientDisplayMessage,
      });
    }
  }
}

export class UnauthorizedError extends AppError {
  constructor(payload: CusmtomErrorPayload) {
    if (typeof payload === 'string') {
      super({ errorObject: ERRORS.UNAUTHORIZED, message: payload });
    } else {
      super({
        errorObject: ERRORS.UNAUTHORIZED,
        message: payload.message,
        clientDisplayMessage: payload.clientDisplayMessage,
      });
    }
  }
}

export class ForbiddenError extends AppError {
  constructor(payload: CusmtomErrorPayload) {
    if (typeof payload === 'string') {
      super({ errorObject: ERRORS.FORBIDDEN, message: payload });
    } else {
      super({
        errorObject: ERRORS.FORBIDDEN,
        message: payload.message,
        clientDisplayMessage: payload.clientDisplayMessage,
      });
    }
  }
}

export class NotFoundError extends AppError {
  constructor(payload: CusmtomErrorPayload) {
    if (typeof payload === 'string') {
      super({ errorObject: ERRORS.NOT_FOUND, message: payload });
    } else {
      super({
        errorObject: ERRORS.NOT_FOUND,
        message: payload.message,
        clientDisplayMessage: payload.clientDisplayMessage,
      });
    }
  }
}

export class ConflictError extends AppError {
  constructor(payload: CusmtomErrorPayload) {
    if (typeof payload === 'string') {
      super({ errorObject: ERRORS.CONFLICT, message: payload });
    } else {
      super({
        errorObject: ERRORS.CONFLICT,
        message: payload.message,
        clientDisplayMessage: payload.clientDisplayMessage,
      });
    }
  }
}

export class PermissionDeniedError extends AppError {
  constructor(payload: CusmtomErrorPayload) {
    if (typeof payload === 'string') {
      super({ errorObject: ERRORS.PERMISSION_DENIED, message: payload });
    } else {
      super({
        errorObject: ERRORS.PERMISSION_DENIED,
        message: payload.message,
        clientDisplayMessage: payload.clientDisplayMessage,
      });
    }
  }
}

export class InternalServerError extends AppError {
  constructor(payload: CusmtomErrorPayload) {
    if (typeof payload === 'string') {
      super({ errorObject: ERRORS.INTERNAL_SERVER, message: payload });
    } else {
      super({
        errorObject: ERRORS.INTERNAL_SERVER,
        message: payload.message,
        clientDisplayMessage: payload.clientDisplayMessage,
      });
    }
  }
}

export class CustomError {}
