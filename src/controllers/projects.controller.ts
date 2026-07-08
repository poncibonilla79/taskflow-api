import { Request, Response } from 'express';
import { projectsService } from '../services/projects.service';
import { CreateProjectDto, UpdateProjectDto } from '../types/project.types';
import { sendSuccess, sendCreated, sendError, sendNoContent } from '../utils/response.util';

export const projectsController = {

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const projects = await projectsService.findAll();
      sendSuccess(res, { data: projects, count: projects.length });
    } catch (error) {
      sendError(res, 500);
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const project = await projectsService.findById(req.params.id as string);
      if (!project) { sendError(res, 404); return; }
      sendSuccess(res, { data: project });
    } catch (error) {
      sendError(res, 500);
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body as CreateProjectDto;
      if (!name) {
        sendError(res, 400, 'name es requerido');
        return;
      }
      const project = await projectsService.create({ name, description }, req.user!.userId);
      sendCreated(res, { data: project });
    } catch (error: any) {
      sendError(res, 500);
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body as UpdateProjectDto;
      const project = await projectsService.update(req.params.id as string, { name, description }, req.user!.userId);
      sendSuccess(res, { data: project });
    } catch (error: any) {
      if (error?.code === 'P2025') { sendError(res, 404); return; }
      if (error?.status === 403) { sendError(res, 403, error.message); return; }
      if (error?.status === 404) { sendError(res, 404, error.message); return; }
      sendError(res, 500);
    }
  },

  async remove(req: Request, res: Response): Promise<void> {
    try {
      await projectsService.remove(req.params.id as string, req.user!.userId);
      sendNoContent(res);
    } catch (error: any) {
      if (error?.code === 'P2025') { sendError(res, 404); return; }
      if (error?.status === 403) { sendError(res, 403, error.message); return; }
      if (error?.status === 404) { sendError(res, 404, error.message); return; }
      sendError(res, 500);
    }
  },
};
