import type { Request, Response, NextFunction } from 'express';
import { treeifyError, } from 'zod';
import { ZodSchema } from 'zod/v4';

export function validateBody<T extends ZodSchema>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: treeifyError(parsed.error),
      });
    }

    // ⭐ Assign validated, typed data back to req.body
    req.body = parsed.data;

    next();
  };
}
