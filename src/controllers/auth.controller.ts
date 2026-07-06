import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../types/auth.types';
import { sendSuccess, sendCreated, sendError } from '../utils/response.util';

export const authController = {

  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.register(req.body as RegisterDto);
      sendCreated(res, result);
    } catch (e: any) {
      sendError(res, e?.status ?? 500, e?.message);
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.login(req.body as LoginDto);
      sendSuccess(res, result);
    } catch (e: any) {
      sendError(res, e?.status ?? 500, e?.message);
    }
  },

  async me(req: Request, res: Response): Promise<void> {
    sendSuccess(res, req.user);
  },
};
