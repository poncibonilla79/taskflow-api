import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.util';

export const errorMiddleware = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error no manejado:', error);

  if (error?.status) {
    sendError(res, error.status, error.message);
    return;
  }

  sendError(res, 500);
};
