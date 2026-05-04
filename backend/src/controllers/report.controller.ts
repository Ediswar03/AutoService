// src/controllers/report.controller.ts

import { Request, Response, NextFunction } from 'express';
import { reportService } from '../services/report.service';
import { sendSuccess } from '../utils/response.util';

export class ReportController {
  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await reportService.getDashboardSummary();
      sendSuccess(res, summary);
    } catch (error) {
      next(error);
    }
  }

  async getRevenue(req: Request, res: Response, next: NextFunction) {
    try {
      const startDate = new Date(
        (req.query.startDate as string) || new Date().toISOString().slice(0, 8) + '01'
      );
      const endDate = new Date(
        (req.query.endDate as string) || new Date().toISOString()
      );

      const report = await reportService.getRevenueReport(startDate, endDate);
      sendSuccess(res, report);
    } catch (error) {
      next(error);
    }
  }

  async getRevenueTimeSeries(req: Request, res: Response, next: NextFunction) {
    try {
      const now = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const startDate = (req.query.startDate as string) ? new Date(req.query.startDate as string) : sevenDaysAgo;
      const endDate = (req.query.endDate as string) ? new Date(req.query.endDate as string) : now;

      const report = await reportService.getRevenueTimeSeries(startDate, endDate);
      sendSuccess(res, report);
    } catch (error) {
      next(error);
    }
  }

  async getMechanicPerformance(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const startDate = new Date(
        (req.query.startDate as string) || new Date().toISOString().slice(0, 8) + '01'
      );
      const endDate = new Date(
        (req.query.endDate as string) || new Date().toISOString()
      );

      const report = await reportService.getMechanicPerformance(
        startDate,
        endDate
      );
      sendSuccess(res, report);
    } catch (error) {
      next(error);
    }
  }

  async getWorkOrderStats(req: Request, res: Response, next: NextFunction) {
    try {
      const startDate = new Date(
        (req.query.startDate as string) || new Date().toISOString().slice(0, 8) + '01'
      );
      const endDate = new Date(
        (req.query.endDate as string) || new Date().toISOString()
      );

      const report = await reportService.getWorkOrderStats(
        startDate,
        endDate
      );
      sendSuccess(res, report);
    } catch (error) {
      next(error);
    }
  }
}

export const reportController = new ReportController();
