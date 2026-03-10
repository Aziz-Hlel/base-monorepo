import { BadRequestError } from '@/err/customErrors';
import { Request } from 'express';
import capitalize from './capitalize';

const getParam = (req: Request, param: string): string => {
  const paramValue = req.params[param];
  if (paramValue === undefined) throw new BadRequestError(`${capitalize(param)} is required in params`);
  if (typeof paramValue !== 'string') throw new BadRequestError(`${capitalize(param)} must be a string`);

  return paramValue;
};

export default getParam;
