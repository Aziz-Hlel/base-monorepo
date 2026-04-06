import ENV from '../config/env';
import { ApiError } from './apiError.type';
import ERRORS, { ErrNames, ErrObject } from './Errors.object';
import ErrorNames, { ErrorNameKeys } from './errors.names';
import { Request } from 'express';

interface IAppError<T extends Error> {
  errorObject: ErrObject;
  error?: T;
  message?: string;
  clientMessage?: string;
  customLog?: string;
}

export class AppError2<T extends Error = Error> extends Error {
  status: number;
  clientDisplayMessage?: string;
  customLog?: string;

  constructor({ error, message, clientMessage, customLog, errorObject }: IAppError<T>) {
    const errorMessage: string = message || error?.message || errorObject.message;
    super(errorMessage, { cause: error });
    this.customLog = customLog;
    this.clientDisplayMessage = clientMessage;
    this.name = errorObject.name;
    this.status = errorObject.status;
  }

  static isAppError(error: Error): error is AppError2 {
    return !!error.name && Object.values(ErrorNames).includes(error.name as ErrorNameKeys);
  }

  static toApiErrorResponse(error: AppError2, req: Request): ApiError {
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

// type ToAppErrorProps<T extends Error> = {
//   error: T;
//   name: ErrNames;
//   message?: string;
//   clientDisplayMessage?: string;
//   customLog?: string;
// };

type CusmtomErrorPayload<T extends Error> = {
  message: string;
  clientDisplayMessage?: string;
  customLog?: string;
  stack?: string;
  error?: T;
};
// export class BadRequestError extends AppError2 {
//   constructor(payload: CusmtomErrorPayload) {
//     super(toSuperPayload({ errorObject: ERRORS.BAD_REQUEST, payload }));
//   }
// }

// export class UnauthorizedError extends AppError2 {
//   constructor(payload: CusmtomErrorPayload) {
//     super(toSuperPayload({ errorObject: ERRORS.UNAUTHORIZED, payload }));
//   }
// }

// export class ForbiddenError extends AppError2 {
//   constructor(payload: CusmtomErrorPayload) {
//     super(toSuperPayload({ errorObject: ERRORS.FORBIDDEN, payload }));
//   }
// }

// export class NotFoundError extends AppError2 {
//   constructor(payload: CusmtomErrorPayload) {
//     super(toSuperPayload({ errorObject: ERRORS.NOT_FOUND, payload }));
//   }
// }

export class ConflictError2<T extends Error> extends AppError2 {
  constructor(payload: CusmtomErrorPayload<T>) {
    super(toSuperPayload({ errorObject: ERRORS.CONFLICT, payload }));
  }
}

// export class PermissionDeniedError extends AppError2 {
//   constructor(payload: CusmtomErrorPayload) {
//     super(toSuperPayload({ errorObject: ERRORS.PERMISSION_DENIED, payload }));
//   }
// }

// export class NotImplementedError extends AppError2 {
//   constructor(payload: CusmtomErrorPayload) {
//     super(toSuperPayload({ errorObject: ERRORS.NOT_IMPLEMENTED, payload }));
//   }
// }

// export class InternalServerError extends AppError2 {
//   constructor(payload: CusmtomErrorPayload) {
//     super(toSuperPayload({ errorObject: ERRORS.INTERNAL_SERVER, payload }));
//   }
// }

// export class CustomError {}

const toSuperPayload = <T extends Error>({
  errorObject,
  payload,
}: {
  errorObject: ErrObject;
  payload: CusmtomErrorPayload<T>;
}) => {
  if (typeof payload === 'string') {
    return { errorObject, message: payload };
  } else {
    return {
      errorObject,
      message: payload.message,
      clientDisplayMessage: payload.clientDisplayMessage,
      customLog: payload.customLog,
      stack: payload.stack,
      error: payload.error,
    };
  }
};
