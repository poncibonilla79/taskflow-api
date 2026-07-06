import { Request, Response } from 'express';
import { commentsService } from '../services/comments.service';
import { CreateCommentDto } from '../types/comment.types';
import { sendSuccess, sendCreated, sendError, sendNoContent } from '../utils/response.util';

export const commentsController = {

  async getByTask(req: Request, res: Response): Promise<void> {
    try {
      const comments = await commentsService.findByTask(req.params.taskId as string);
      sendSuccess(res, { data: comments, count: comments.length });
    } catch (e: any) { sendError(res, e?.status ?? 500, e?.message); }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const comment = await commentsService.create(req.body as CreateCommentDto, req.user!.userId);
      sendCreated(res, { data: comment });
    } catch (e: any) { sendError(res, e?.status ?? 500, e?.message); }
  },

  async remove(req: Request, res: Response): Promise<void> {
    try {
      await commentsService.remove(req.params.id as string, req.user!.userId);
      sendNoContent(res);
    } catch (e: any) { sendError(res, e?.status ?? 500, e?.message); }
  },
};
