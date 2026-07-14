import { Request, Response } from 'express';
import { tasksService } from '../services/tasks.service';
import { CreateTaskDto, UpdateTaskDto } from '../types/task.types';
import { sendSuccess, sendCreated, sendError, sendNoContent } from '../utils/response.util';

export const tasksController = {

  async getByProject(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await tasksService.findByProject(
        req.params.projectId as string,
        req.query.status as string | undefined
      );
      sendSuccess(res, tasks);
    } catch (e: any) { sendError(res, e?.status ?? 500, e?.message); }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const task = await tasksService.findById(req.params.id as string);
      if (!task) { sendError(res, 404); return; }
      sendSuccess(res, task);
    } catch (e: any) { sendError(res, e?.status ?? 500, e?.message); }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const task = await tasksService.create(req.body as CreateTaskDto, req.user!.userId);
      sendCreated(res, task);
    } catch (e: any) { sendError(res, e?.status ?? 500, e?.message); }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const task = await tasksService.update(
        req.params.id as string, req.body as UpdateTaskDto, req.user!.userId
      );
      sendSuccess(res, task);
    } catch (e: any) { sendError(res, e?.status ?? 500, e?.message); }
  },

  async remove(req: Request, res: Response): Promise<void> {
    try {
      await tasksService.remove(req.params.id as string, req.user!.userId);
      sendNoContent(res);
    } catch (e: any) { sendError(res, e?.status ?? 500, e?.message); }
  },
};
