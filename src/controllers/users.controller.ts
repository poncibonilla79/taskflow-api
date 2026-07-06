import { Request, Response } from 'express';
import { usersService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto } from '../types/user.types';
import { sendSuccess, sendCreated, sendError, sendNoContent } from '../utils/response.util';

export const usersController = {

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await usersService.findAll();
      sendSuccess(res, { data: users, count: users.length });
    } catch (error) {
      sendError(res, 500);
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const user = await usersService.findById(req.params.id as string);
      if (!user) { sendError(res, 404); return; }
      sendSuccess(res, { data: user });
    } catch (error) {
      sendError(res, 500);
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body as CreateUserDto;
      if (!name || !email || !password) {
        sendError(res, 400, 'name, email y password son requeridos');
        return;
      }
      const exists = await usersService.existsByEmail(email);
      if (exists) { sendError(res, 409); return; }
      const user = await usersService.create({ name, email, password });
      sendCreated(res, { data: user });
    } catch (error) {
      sendError(res, 500);
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { name, email } = req.body as UpdateUserDto;
      const user = await usersService.update(req.params.id as string, { name, email });
      sendSuccess(res, { data: user });
    } catch (error: any) {
      if (error?.code === 'P2025') { sendError(res, 404); return; }
      sendError(res, 500);
    }
  },

  async remove(req: Request, res: Response): Promise<void> {
    try {
      await usersService.remove(req.params.id as string);
      sendNoContent(res);
    } catch (error: any) {
      if (error?.code === 'P2025') { sendError(res, 404); return; }
      sendError(res, 500);
    }
  },
};
