const ErrorNames = {
  BAD_REQUEST: 'BadRequestError',
  UNAUTHORIZED: 'UnauthorizedError',
  FORBIDDEN: 'ForbiddenError',
  NOT_FOUND: 'NotFoundError',
  CONFLICT: 'ConflictError',
  INTERNAL_SERVER: 'InternalServerError',
} as const;
export default ErrorNames;

export type ErrorNameKeys = (typeof ErrorNames)[keyof typeof ErrorNames];
