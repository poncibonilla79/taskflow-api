import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { sendError } from '../utils/response.util';

export const validate = (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body:   req.body,
      params: req.params,
      query:  req.query,
    });

    if (!result.success) {
      const details = result.error.issues.map(e => ({
        field:   e.path.slice(1).join('.'),
        message: e.message,
      }));
      const body: any = {
        status: 400,
        message: 'Datos de entrada inválidos',
        error: 'Datos de entrada inválidos',
        details,
        timestamp: new Date().toISOString(),
      };
      res.status(400).json(body);
      return;
    }
    next();
  };
