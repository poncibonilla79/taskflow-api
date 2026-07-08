import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { sendSuccess, sendError } from '../utils/response.util';

export const dashboardController = {

  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await dashboardService.getStats(req.user!.userId);
      sendSuccess(res, stats);
    } catch (e: any) {
      sendError(res, e?.status ?? 500, e?.message);
    }
  },
};
