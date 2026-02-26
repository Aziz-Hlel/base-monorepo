import ErrorNames, { ErrorNameKeys } from '../errors.names';
import ERRORS, { Err } from '../Errors.object';

export type SES_ErrorCode =
  | 'MessageRejected'
  | 'AccessDeniedException'
  | 'ThrottlingException'
  | 'ServiceUnavailableException'
  | 'ValidationError';

type CustomErrorObj = {
  getDisplayMessage: () => string | undefined;
  getLogMessage: () => string | undefined;
  err: Err;
};

export const SES_Errors: Record<SES_ErrorCode, CustomErrorObj> = {
  MessageRejected: {
    getDisplayMessage: () => 'Message rejected',
    getLogMessage: () => 'Message rejected',
    err: ERRORS.INTERNAL_SERVER,
  },
  AccessDeniedException: {
    getDisplayMessage: () => 'Access denied',
    getLogMessage: () => 'Access denied',
    err: ERRORS.UNAUTHORIZED,
  },
  ThrottlingException: {
    getDisplayMessage: () => 'Throttling exception',
    getLogMessage: () => 'Throttling exception',
    err: ERRORS.TOO_MANY_REQUESTS,
  },
  ServiceUnavailableException: {
    getDisplayMessage: () => 'Service unavailable',
    getLogMessage: () => 'Service unavailable',
    err: ERRORS.SERVICE_UNAVAILABLE,
  },
  ValidationError: {
    getDisplayMessage: () => 'Validation error',
    getLogMessage: () => 'Validation error',
    err: ERRORS.INTERNAL_SERVER,
  },
};

export const sesErrorExplanations: Record<
  SES_ErrorCode,
  { message: string; explanation: string; code: number; name: ErrorNameKeys }
> = {
  MessageRejected: {
    message: 'Message rejected',
    explanation: `
    ° Sender email/domain not verified
    ° Account still in sandbox
    ° Recipient not verified (sandbox mode)
    ° Content rejected by SES policy
    `,
    code: 400,
    name: ErrorNames.BAD_REQUEST,
  },
  AccessDeniedException: {
    message: 'Access denied',
    explanation: `
    ° Bad IAM permissions
    ° Wrong role
    ° Missing ses:SendEmail`,
    code: 401,
    name: ErrorNames.UNAUTHORIZED,
  },
  ThrottlingException: {
    message: 'Throttling exception',
    explanation: `
    ° Rate limit exceeded
    ° Burst limit exceeded`,
    code: 429,
    name: ErrorNames.TOO_MANY_REQUESTS,
  },
  ServiceUnavailableException: {
    message: 'Service unavailable',
    explanation: `
    ° AWS temporary outage
    ° Regional instability`,
    code: 503,
    name: ErrorNames.SERVICE_UNAVAILABLE,
  },
  ValidationError: {
    message: 'Validation error',
    explanation: `
    ° Invalid email format
    ° Missing required fields
    ° Malformed payload`,
    code: 500,
    name: ErrorNames.INTERNAL_SERVER,
  },
};
